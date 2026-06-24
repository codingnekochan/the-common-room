const { body, validationResult, matchedData } = require("express-validator");
const UserService = require("../models/users");
const { generateHash, validatePassword } = require("../middlewares/auth");
const { passport } = require("../middlewares/passport");
const { mapError } = require("../middlewares/error");

const validateNewUser = [
  body("username").trim().notEmpty().isAlpha(),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid Email Address")
    .custom(async (val) => {
      const existingUser = await UserService.findUserByEmail(val);
      if (existingUser) {
        throw new Error("E-mail already in use");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
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
    .withMessage("Invalid Email Address")
    .custom(async (val) => {
      const existingUser = await UserService.findUserByEmail(val);
      if (!existingUser) {
        throw new Error("User does not exist");
      }
    }),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];
const validateClubPasscode = [
  body("passcode").trim().notEmpty().withMessage("Enter a valid passcode"),
];
const getSignUpForm = (req, res) => {
  const error = req.session.authError;
  delete req.session.authError;
  res.render("signup", { error });
};
const signup = [
  validateNewUser,
  async (req, res, next) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        req.session.authError = mapError(result);
        return res.redirect("/signup");
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
  const error = req.session.authError;
  delete req.session.authError;
  res.render("login", { error });
};

const login = [
  validateReturningUser,
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      req.session.authError = mapError(result);
      return res.redirect("/login");
    }
    passport.authenticate("local", (err, user, info) => {
      if (err) next(err);
      if (!user) {
        req.session.authError =
          info?.message ?? "That name and passphrase do not match our records";
        return res.redirect("/login");
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
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
    return res.redirect("/login");
  }
  const error = req.session.authError;
  delete req.session.authError;
  return res.render("join", { error });
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
        req.session.authError = "Invalid passcode";
        return res.redirect("/join");
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
