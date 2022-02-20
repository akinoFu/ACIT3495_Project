const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const userController = require("../controllers/userController");
const localLogin = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  (email, password, done) => {
    const user = userController.getUserByEmailIdAndPassword(email, password);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
  }
);

const githublogin = new GitHubStrategy(
  {
    clientID: "1269d5241039b779c65a",
    clientSecret: "2090f19a24b9f5b66076b927d3002fb02a956b5b",
    callbackURL: "http://localhost:8000/auth/github/callback"
  },
  (accessToken, refreshToken, profile, cb) => {
    let user = userController.getGitHubIdAndPassword(profile);
    return cb(null,user)
  }
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

module.exports = passport.use(localLogin).use(githublogin);
