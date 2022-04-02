var express = require("express");
const session = require('express-session');
const bodyParser = require('body-parser');
const expressLayouts = require("express-ejs-layouts");
const port = process.env.port || 3002;
const HOST = '0.0.0.0';
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const MongoClient = require('mongodb').MongoClient
// const mysql = require('mysql');

app.use(session({
  secret: 'secret$%^134',
  resave: false,
  saveUninitialized: false,
  name: 'data',
  cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie 
      maxAge: 1000 * 60 * 10 // session max age in miliseconds
  }
}))

var subject
var grade
var user
app.use(express.json());
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

const fs = require('fs');
const yaml = require('js-yaml');
try {
  let fileContents = fs.readFileSync('./app_conf.yml', 'utf8');
  const data = yaml.load(fileContents);

  var host = data['host']
  var mgb = data['mongodb'];

} catch (e) {
  console.log(e);
}

const connectionString = `mongodb://${mgb['user']}:${mgb['password']}@${mgb['hostname']}:${mgb['port']}/`;

MongoClient.connect(connectionString, {useUnifiedTopology: true})
  .then(client => {
    console.log('Connected to Mongo Database')
    const db = client.db('project')

    app.post('/add',(req, res) => {
      req.session.subject = req.body.subject,
      req.session.grade = req.body.grade
      subject = req.body.subject,
      grade = req.body.grade
      console.log(req.session)
      req.session.save((err) => {
        if (err) {
            return next(err);
        }res.status(200).send('OK');
      });
    });
    app.get('/',function(req,res) {
      res.redirect('/app2')
    });
    app.get('/app2',function(req,res) {
        const sess = req.session;
        req.session.subject = subject,
        req.session.grade = grade
        req.session.user = user
        
        if (typeof user !== 'undefined' && user !=''){
          db.collection('analytics').find({ name: req.session.user } ).toArray()
            .then(users => {
              console.log('result:',users, typeof(users[0]))
              if ((typeof(users[0]) != "undefined")){
                res.render("dashboard", {
                  user: users[0]['name'],
                  max: users[0]['max'],
                  min: users[0]['min'],
                  avg: users[0]['avg']
                });
              }else {
              res.render("dashboard", {
                user: req.session.user,
                max: 0,
                min: 0,
                avg: 0
              });
            }
            })
            .catch(/* ... */);
        } else {
          res.end(`<p>Please first log in at <a href='http://${host}:3000'>this link </a></p>`)
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
      })
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
  });
app.listen(port, HOST);
console.log(`🚀 Server running on http://${HOST}:${port}`);