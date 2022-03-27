const express  = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require("path");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// enable this if you run behind a proxy (e.g. nginx)
app.set('trust proxy', 1);
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
//Configure session middleware
app.use(session({
    // store: new RedisStore({ client: redisClient }),
    secret: 'secret$%^134',
    resave: false,
    saveUninitialized: false,
    name:'auth',
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie 
        maxAge: 1000 * 60 * 10 // session max age in miliseconds
    }
}))

const expressLayouts = require("express-ejs-layouts");



const port = process.env.port || 3000;
const HOST = '0.0.0.0';

const serverOne = 'http://localhost:3001/user';
const serverTwo = 'http://localhost:3002/user';

const passport = require("./middleware/passport");
// const authRoute = require("./routes/authRoute");
// const indexRoute = require("./routes/indexRoute");

const authRoute = require("./routes/authRoute");
const indexRoute = require("./routes/indexRoute");

// Middleware for express
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(`User details are: `);
  console.log(req.user);

  console.log("Entire session object:");
  console.log(req.session);

  console.log(`Session details are: `);
  console.log(req.session.passport);
  next();
});

app.use("/", indexRoute);
app.use("/auth", authRoute);

// app.get("/", (req, res) => {
//     const sess = req.session;
//     if (sess.username && sess.password) {
//         if (sess.username) {
//             res.render("dashboard", {
//                 user: sess.username,
//               });
//         }
//     } else {
//         res.sendFile(__dirname + "/login.html")
//     }
// });

// app.post("/login", (req, res) => {
//     const sess = req.session;
//     const { username, password } = req.body
//     sess.username = username
//     sess.password = password

//     if (sess.username == sess.password) {
//         axios
//         .post(serverOne, {
//           user: sess.username
//         })
//         .then((res) => {
//           console.log(`App1 statusCode: ${res.statusCode}`)
//         //   console.log(res)
          
//         })
//         .catch((error) => {
//           console.error(error)
//         }),
//         axios
//         .post(serverTwo, {
//           user: sess.username
//         })
//         .then((res) => {
//           console.log(`App2 statusCode: ${res.statusCode}`)
//         //   console.log(res)
          
//         })
//         .catch((error) => {
//           console.error(error)
//         })
//     }
//     res.render("dashboard", {
//         user: sess.username,
//       });
// });

// app.get("/logout", (req, res) => {
//     req.session.destroy(err => {
//         if (err) {
//             return console.log(err);
//         }
//         res.redirect("/")
//     });
// });

app.listen(3000, () => {
    console.log(`🚀 Server running on http://${HOST}:${port}`);
});
