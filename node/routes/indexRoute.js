const express = require("express");
const router = express.Router();
const MongoClient = require('mongodb').MongoClient
const mysql = require('mysql');

const fs = require('fs');
const yaml = require('js-yaml');
try {
  let fileContents = fs.readFileSync('./app_conf.yml', 'utf8');
  const data = yaml.load(fileContents);

  var sql = data['mysql'];
  var mgb = data['mongodb'];

} catch (e) {
  console.log(e);
}
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const connectionString = `mongodb://${mgb['user']}:${mgb['password']}@${mgb['hostname']}:${mgb['port']}/`;


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Mongo Database')
    const db = client.db('project')
    // const collection = db.collection('analytics')
    router.get("/", (req, res) => {
      res.render("enterdata");
    });
    router.post("/", (req, res) => {
      req.session.body = req.body
      // console.log(req.user.name, req.body.Subject, req.body.Grade)
      res.redirect("/auth/login")
    });

    router.get("/dashboard", ensureAuthenticated, (req, res) => {
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
        var sql = `INSERT INTO grades (name, subject, grade) VALUES ('${req.user.name}', '${req.session.body.Subject}', ${req.session.body.Grade})`;
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
      function sleep(ms) {
        return new Promise((resolve) => {
          setTimeout(resolve, ms);
        });
      }
      sleep(5000).then(() => 
      db.collection('analytics').find({ name: req.user.name } ).toArray()
        .then(user => {
          console.log(user)
          res.render("dashboard", {
            user: user[0]['name'],
            max: user[0]['max'],
            min: user[0]['min'],
            avg: user[0]['avg']
          });
        })
        .catch(/* ... */) );
      // res.render("dashboard", {
      //   user: req.user,
      //   subject: req.session.body.Subject,
      //   grade: req.session.body.Grade
      // });
    });

    router.get('/test', (req, res) => {
      console.log('test')
      console.log(req.user.name)
      db.collection('analytics').find({ name: req.user.name } ).toArray()
        .then(user => {
          console.log(user)
          res.send(`Name: ${user[0]['name']} \n Highest: ${user[0]['max']} \n Lowest: ${user[0]['min']} \n Average: ${user[0]['avg']}`)
        })
        .catch()
    })
    router.get('/admin', isAdmin, (req, res) => {
      const store = req.sessionStore;
      store.all((error, sessions) => {
          if (error) {
              console.log(error);
          }
          else{
            //console.log(sessions);
            var arry = sessions
          }
          res.render("admin", {
          user: req.user,
          arry:arry
        });
      });
    });

    router.post(
      "/del_session",
      (req,res) =>{
        let sesId = req.body.sessionID
        console.log("Ding, dong, ding,dong")
        console.log(sesId)
        let store = req.sessionStore

        store.destroy(sesId,(err) => {
          if (err){
            console.log(err)
          }
          else{
            store.sessionStore
            res.redirect("/admin")
          }
        })

      }
    );
  })
  .catch(console.error)

module.exports = router;
