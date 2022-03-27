const express = require("express");
const router = express.Router();
const axios = require('axios');
// const serverOne = 'http://localhost:3001/user';
// const serverTwo = 'http://localhost:3002/user';

const MongoClient = require('mongodb').MongoClient
const mongodb = require( 'mongodb' );
// const mysql = require('mysql');

const fs = require('fs');
const yaml = require('js-yaml');
try {
  let fileContents = fs.readFileSync('./app_conf.yml', 'utf8');
  const data = yaml.load(fileContents);

  var mgb = data['mongodb'];
  var host = data['host']

} catch (e) {
  console.log(e);
}
const serverOne = `http://${host}:3001/user`;
const serverTwo = `http://${host}:3002/user`;
const { ensureAuthenticated, isAdmin } = require("../middleware/checkAuth");
const connectionString = `mongodb://${mgb['user']}:${mgb['password']}@${mgb['hostname']}:${mgb['port']}/`;


MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Mongo Database')
    const db = client.db('project')
    // const collection = db.collection('analytics')
    router.get("/", (req, res) => {
      res.render("login");
    });
    router.post("/", (req, res) => {
      req.session.body = req.body
      // console.log(req.user.name, req.body.Subject, req.body.Grade)
      res.redirect("/auth/login")
    });

    router.get("/dashboard", ensureAuthenticated, (req, res) => {
      // var con = mysql.createConnection({
      //   host: sql['hostname'],
      //   user: sql['user'],
      //   password: sql['password'],
      //   database: sql['db'],
      //   port: sql['port']
      // });
      // con.connect(function(err) {
      //   if (err) throw err;
      //   console.log("Connected!");
      //   var sql = `INSERT INTO grades (name, subject, grade) VALUES ('${req.user.name}', '${req.session.body.Subject}', ${req.session.body.Grade})`;
      //   con.query(sql, function (err, result) {
      //     if (err) throw err;
      //     console.log("1 record inserted");
      //   });
      // });
      // function sleep(ms) {
      //   return new Promise((resolve) => {
      //     setTimeout(resolve, ms);
      //   });
      // }
      // sleep(5000).then(() => 
      // db.collection('analytics').find({ name: req.user.name } ).toArray()
      //   .then(user => {
      //     console.log(user)
      //     res.render("dashboard", {
      //       user: user[0]['name'],
      //       max: user[0]['max'],
      //       min: user[0]['min'],
      //       avg: user[0]['avg']
      //     });
      //   })
      //   .catch(/* ... */) );
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
        user: req.user.name,
        // subject: req.session.body.Subject,
        // grade: req.session.body.Grade
      });
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
      db.collection('analytics').find().toArray()
        .then(user => {
          console.log(user)
          res.render("admin", {
            admin: req.user.name,
            users: user
          });
          // res.send(`Name: ${user[0]['name']} \n Highest: ${user[0]['max']} \n Lowest: ${user[0]['min']} \n Average: ${user[0]['avg']}`)
        })
        .catch()
    });

    router.post(
      "/del_session",
      (req,res) =>{
        console.log(typeof(req.body.userid))
        db.collection('analytics').deleteOne({_id: new mongodb.ObjectId(req.body.userid)});
        res.redirect("/admin")
      //   db.collection('analytics').deleteOne({ "_id": new ObjectId(req.body.userid)}, (err, res) => {
      //     if (err){
      //       console.log("failed");
      //       throw err;
      //     }
      //     console.log("success");
      //   });
      //   res.redirect("/admin")
       });
  })
  .catch(console.error)

module.exports = router;
