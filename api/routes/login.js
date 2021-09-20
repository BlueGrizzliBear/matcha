var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var Models = require('../models/models');
var activation = require("./activation");

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


/* POST /register/send_link - Send an email link verification again */
router.post('/activation_link', function (req, res, next) {
  const user = new Models.User(null, req.body.username);

  user.find(function (error, results) {
    if (error) {
      console.log(error);
      res.status(400).end();
    }
    else {
      req.body.id = user.getUserId();
      activation.sendLinkVerification(req, res);
      res.status(200).end();
    }
  });
});

/* POST /login/forgot_password - Send an email link to reset password */
router.post('/forgot_password', function (req, res, next) {
  const user = new Models.User(null, req.body.username);

  user.find(function (error, results) {
    if (error) {
      console.log(error);
      res.status(400).end();
    }
    else {
      req.body.id = results[0].id;
      req.body.username = results[0].username;
      req.body.email = results[0].email;
      activation.sendPasswordResetLink(req, res);
      res.status(200).end();
    }
  });
});

module.exports = router;
