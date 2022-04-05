var express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const expressLayouts = require("express-ejs-layouts");
const port = process.env.port || 3001;
const HOST = '0.0.0.0';
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const axios = require('axios');
const mysql = require('mysql');

app.use(session({
  secret: 'secret$%^134',
  resave: false,
  saveUninitialized: false,
  name: 'front',
  cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie 
      maxAge: 1000 * 60 * 10 // session max age in miliseconds
  }
}))

var user
app.use(express.json());
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
const fs = require('fs');
const yaml = require('js-yaml');
try {
  let fileContents = fs.readFileSync('./app_conf.yml', 'utf8');
  const data = yaml.load(fileContents);

  var sql = data['mysql'];

} catch (e) {
  console.log(e);
}
const url = `http://localhost:3001/add`
app.get('/',function(req,res) {
  res.redirect('/app1')
});
app.get('/app1',function(req,res) {
    console.log(user)
    if (typeof user !== 'undefined' && user !=''){
      res.render("display", {
      user: user
    });
    console.log(req.session)
    } else {
      res.end(`<p>Please first log in at <a href='http://localhost:3000'>this link </a></p>`)
    }
    
});

app.post("/app1", (req,res) =>{
  if (typeof user !== 'undefined' && user !='') {
    req.session.subject = req.body.subject
    req.session.grade = req.body.grade
    console.log(req.session)
    axios
      .post(url, {
        subject: req.session.subject, grade:req.session.grade
      })
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
        
      })
      .catch((error) => {
        console.error(error)
      });
    var con = mysql.createConnection({
        host: sql['hostname'],
        user: sql['user'],
        password: sql['password'],
        database: sql['db'],
        port: sql['port']
      });
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `INSERT INTO grades (name, subject, grade) VALUES ('${user}', '${req.session.subject}', ${req.session.grade})`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      })
      function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
      sleep(5000).then (() =>res.redirect("/app1"))
  }else {
    res.end(`<p>Please first log in at <a href='http://localhost:3000'>this link </a></p>`)
  }
  
});

app.post('/user',(req, res) => {
  req.session.user = req.body.user,
  user = req.body.user,
  console.log(req.session)
  req.session.save((err) => {
    if (err) {
        return next(err);
    }res.status(200).send('OK');
  });
});

app.post('/logout',(req, res) => {
  req.session.user = req.body.user,
  user = req.body.user,
  req.session.destroy(err => {
      if (err) {
          return console.log(err);
      }
      res.redirect("/")
  });
  res.status(200).send('OK');
});

app.listen(port, HOST);
console.log(`🚀 Server running on http://${HOST}:${port}`);