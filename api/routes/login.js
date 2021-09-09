var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
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
          var user = {
            id: results[0].id,
            username: results[0].username,
            firstname: results[0].firstname,
            lastname: results[0].lastname,
            email: results[0].email,
            activated: results[0].activated,
          };
          const token = jwt.sign(user, process.env.SECRET, {
            expiresIn: '1h'
          });
          user.token = token;
          user.status = "200";
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
