const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

//github
router.get("/github", passport.authenticate("github"));
router.get('/github/callback',passport.authenticate('github', { failureRedirect: '/auth/login' }),
function(req, res) {
  res.redirect("/dashboard");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
