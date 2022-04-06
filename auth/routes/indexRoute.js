const express = require("express");
const router = express.Router();
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient
const mongodb = require( 'mongodb' );
const mysql = require('mysql');

const fs = require('fs');
const yaml = require('js-yaml');
try {
  let fileContents = fs.readFileSync('./app_conf.yml', 'utf8');
  const conf = yaml.load(fileContents);

  var mgb = conf['mongodb'];
  var host = conf['host'];
  var sql = conf['mysql'];
  var front = conf['front'];
  var data = conf['data'];

} catch (e) {
  console.log(e);
}
const serverOne = `http://${front['host']}:3001/user`;
const serverTwo = `http://${data['host']}:3002/user`;
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const connectionString = `mongodb://${mgb['user']}:${mgb['password']}@${mgb['hostname']}:${mgb['port']}/`;


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Mongo Database')
    console.log(serverOne)
    console.log(serverTwo)
    const db = client.db('project')
    router.get("/", (req, res) => {
      res.render("login");
    });
    router.post("/", (req, res) => {
      req.session.body = req.body
      res.redirect("/auth/login")
    });

    router.get("/dashboard", ensureAuthenticated, (req, res) => {
      const sess = req.session;
      axios
        .post(serverOne, {
          user: req.user.name
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
          user: req.user.name
        })
        .then((res) => {
          console.log(`App2 statusCode: ${res.statusCode}`)
        //   console.log(res)
          
        })
        .catch((error) => {
          console.error(error)
        })
      res.render("dashboard", {
        user: req.user.name
      });
    });

    router.get('/admin', isAdmin, (req, res) => {
      db.collection('analytics').find().toArray()
        .then(user => {
          console.log(user)
          res.render("admin", {
            admin: req.user.name,
            users: user
          });
        })
        .catch()
    });

    router.post(
      "/del_session",
      (req,res) =>{
        console.log(typeof(req.body.userid))
        db.collection('analytics').deleteOne({_id: new mongodb.ObjectId(req.body.userid)});
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
          var sql = `DELETE FROM grades WHERE name = '${req.body.username}'`;
          con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("record deleted");
          });
        });
        res.redirect("/admin")
       });
  })
  .catch(console.error)

module.exports = router;
