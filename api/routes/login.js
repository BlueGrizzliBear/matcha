var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
// var jwt = require('jsonwebtoken');
var issueUserToken = require('./token');
const connection = require('./connection');

const login = async function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  connection.query('SELECT * FROM users WHERE username = ?', [username], async function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(400).end();
    }
    else {
      if (results.length > 0) {
        const comparison = await bcrypt.compare(password, results[0].password)
        if (comparison) {
          // Issue token
          var user = issueUserToken(results[0]);
          console.log("User login successfull");
          res.status(200).json(user).end();
        }
        else {
          console.log("Username and password does not match");
          res.status(204).json({
            status: "204",
            error: "Username and password does not match",
          }).end()
        }
      }
      else {
        console.log("Username does not exist");
        res.status(206).json({
          status: "206",
          error: "Username does not exist",
        }).end();
      }
    }
  });
}

/* GET home page. */
router.post('/', function (req, res, next) {
  login(req, res);
});

module.exports = router;
