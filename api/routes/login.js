var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var Models = require('../models/models');

/* POST /login - User login with username and password and send back token */
router.post('/', function (req, res, next) {
  var password = req.body.password;
  const user = new Models.User(null, req.body.username);

  user.find(function (error, results) {
    if (error) {
      console.log(error);
      res.status(400).end();
    }
    else {
      bcrypt.compare(password, results[0].password, function (err, compare) {
        if (compare) {
          // Issue token
          console.log("comparison is OK");
          const token = new Models.Token(user.getUserId(), null);
          token.generate({ id: user.getUserId(), username: user.getUsername() }, '1h', function (error, results) {
            if (error) {
              console.log("error occured inserting token in tokens table");
              res.status(400).end();
            }
            else {
              console.log("User login successfull");
              res.status(200).json({
                id: user.getUserId(),
                username: user.getUsername(),
                token: token.getToken(),
                status: "200"
              }).end();
            }
          });
        }
        else {
          console.log("Username and password does not match");
          res.status(204).json({
            status: "204",
            error: "Username and password does not match",
          }).end();
        }
      });
    }
  });
});

module.exports = router;
