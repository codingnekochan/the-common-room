const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const store = require("connect-pg-simple")(session);
const pool = require("../models/pool");
const UserService = require("../models/users");
const { validatePassword } = require("./auth");

const useSessionStore = session({
  name: "roomAccess",
  store: new store({
    pool,
  }),
  secret: process.env.COOKIE_SECRET,
  cookie: { maxAge: 1000 * 60 * 10 },
  rolling: false,
  saveUninitialized: false,
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await UserService.findUserByEmail(email);
        if (!user) {
          return done(null, false);
        }
        const isValid = await validatePassword(password, user.hash);
        console.log(isValid, "password validity");
        if (!isValid) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        console.log(error, "error authencating");
        done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserService.findUserById(id);
    done(null, {
      id: user.id,
      username: user.username,
      isAdmin: user.isadmin,
      isMember: user.ismember,
    });
  } catch (error) {
    done(error);
  }
});

module.exports = {
  useSessionStore,
  passport,
};
