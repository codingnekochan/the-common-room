const { body, validationResult, matchedData } = require("express-validator");
const UserService = require("../models/users");
const { generateHash } = require("../middlewares/auth");
const { passport } = require("../middlewares/passport");
const { mapError } = require("../middlewares/error");

const validateNewUser = [
  body("username").trim().notEmpty().isAlpha(),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .custom(async (val) => {
      const existingUser = await UserService.findUserByEmail(val);
      if (existingUser) {
        throw new Error("E-mail already in use");
      }
    }),
  body("password").trim().notEmpty().isLength({ min: 8 }),
  body("confirmPassword")
    .trim()
    .custom((val, { req }) => {
      console.log({ val, req: req.body }, "confirm password express validator");
      if (!val) throw new Error("Please confirm your password");

      if (val != req.body.password) {
        throw new Error("Passwords do not match");
      }
      return val === req.body.password;
    }),
];
const validateReturningUser = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .custom(async (val) => {
      const existingUser = await UserService.findUserByEmail(val);
      if (!existingUser) {
        throw new Error("User does not exist");
      }
    }),
  body("password").trim().notEmpty().isLength({ min: 8 }),
];
const validateClubPasscode = [
  body("passcode").trim().notEmpty().withMessage("Enter a valid passcode"),
];
const getSignUpForm = (req, res) => {
  res.render("signup", { error: null });
};
const signup = [
  validateNewUser,
  async (req, res, next) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.render("signup", {
          error: mapError(result)
        });
      }
      const { username, email, password } = matchedData(req);
      const hash = await generateHash(password);
      const user = await UserService.createUser({ username, email, hash });
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
];

const getLoginForm = (req, res) => {
  res.render("login", { error: null });
};

const login = [
  validateReturningUser,
  (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureMessage: "Failed to gain entry",
    })(req, res, next);
  },
];

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("roomAccess");
      res.redirect("/");
    });
  });
};

const getClubForm = (req, res) => {
  if (req.isUnauthenticated()) {
    return res.redirect("/login", { error: null });
  }
  return res.render("join", { error: null });
};
const joinClub = [
  validateClubPasscode,
  async (req, res, next) => {
    try {
      const { passcode } = matchedData(req);
      if (
        passcode !== process.env.ADMIN_PASSCODE &&
        passcode !== process.env.MEMBER_PASSCODE
      ) {
        return res.render("join", { error: "Invalid passcode" });
      }
      if (passcode === process.env.MEMBER_PASSCODE) {
        await UserService.updateUserToMember(req.user.id);
        return res.redirect("/");
      }
      if (passcode === process.env.ADMIN_PASSCODE) {
        await UserService.updateUserToAdmin(req.user.id);
        return res.redirect("/");
      }
    } catch (error) {
      next(error);
    }
  },
];

module.exports = {
  getClubForm,
  getSignUpForm,
  getLoginForm,
  signup,
  login,
  logout,
  joinClub,
};
