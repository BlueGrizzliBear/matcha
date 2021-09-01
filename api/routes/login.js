var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const login = async function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'matcha_db'
  });
  connection.query('SELECT * FROM users WHERE username = ?', [username], async function (error, results, fields) {
    if (error) {
      console.log(error);
      res.status(400).json({
        status: "400",
        failed: "error occurred",
        error: error
      })
    } else {
      if (results.length > 0) {
        const comparison = await bcrypt.compare(password, results[0].password)
        if (comparison) {
          // Issue token
          const id = results[0].id
          const token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: '1h'
          });
          console.log("login successfull");
          res.status(200)
            // Provide a valid token to the user
            // .header('Authorization', 'Bearer ' + token)
            .json({
              status: "200",
              success: "login successful",
              token: token,
              id: results[0].id,
              username: results[0].username,
              // "score": results[0].score,
              // "gamesPlayed": results[0].gamesPlayed,
              // "boardPref": results[0].boardPref
            })
        }
        else {
          console.log("Username and password does not match");
          res.status(204).json({
            status: "204",
            error: "Username and password does not match",
          })
        }
      }
      else {
        console.log("Username does not exist");
        res.status(206).json({
          status: "206",
          error: "Username does not exist",
        });
      }
    }
  });
}

/* GET home page. */
router.post('/', function (req, res, next) {
  login(req, res);
});

module.exports = router;
