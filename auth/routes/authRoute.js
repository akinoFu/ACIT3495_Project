const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");
const axios = require('axios');
const fs = require('fs');
const yaml = require('js-yaml');
try {
  let fileContents = fs.readFileSync('./app_conf.yml', 'utf8');
  const data = yaml.load(fileContents);


} catch (e) {
  console.log(e);
}
const serverOne = `http://${front['host']}:3001/logout`;
const serverTwo = `http://${data['host']}:3002/logout`;

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
  axios
        .post(serverOne, {
          user: ''
        })
        .then((res) => {
          console.log(`App1 statusCode: ${res.statusCode}`)
        //   console.log(res)
          
        })
        .catch((error) => {
          console.error(error)
        }),
        axios
        .post(serverTwo, {
          user: ''
        })
        .then((res) => {
          console.log(`App2 statusCode: ${res.statusCode}`)
        //   console.log(res)
          
        })
        .catch((error) => {
          console.error(error)
        })
  res.redirect("/");
});

module.exports = router;
