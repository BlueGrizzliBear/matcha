var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const connection = require('./connection');

// middleware to use on path everytime user acces sensitiv data
// check if a token exist and is valid
const withAuth = function (req, res, next) {
  const bearerToken = req.headers.authorization;
  console.log("bearer token:" + bearerToken);
  if (!bearerToken) {
    console.log("Unauthorized: No token provided");
    res.status(401).json({
      status: "401",
      success: 'Unauthorized: No token provided'
    });
  }
  else {
    const token = bearerToken.split(' ')[1]
    console.log("token:" + token);
    if (token) {
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) {
          console.log("Unauthorized: Invalid token");
          res.status(401).json({
            status: "401",
            success: 'Unauthorized: Invalid token'
          });
        }
        else {
          req.id = decoded.id;
          // verifier le format des elements decodés
          connection.query('SELECT * FROM users WHERE id = ? AND email = ? ', [decoded.id, decoded.email], async function (error, results, fields) {
            if (error) {
              console.log(error);
              res.status(400).json({
                status: "400",
                failed: "error occurred",
                error: error
              })
            }
            else {
              if (!results[0]) {
                console.log("Unauthorized: Invalid token");
                res.status(401).json({
                  status: "401",
                  success: 'Unauthorized: Invalid token'
                });
              }
              else if (!results[0].activated) {
                console.log("Account not activated");
                res.status(200).json({
                  status: "200",
                  success: 'Account not activated'
                });
              }
              else {
                console.log("account email verified next");
                next();
              }
            }
          });
        }
      });
    }
    else {
      console.log("null token");
      res.status(401).send('Unauthorized: No token provided');
    }
  }
}

/* GET home page. */
router.post('/', withAuth, function (req, res, next) {
  res.status(200).send("ok");
});

module.exports = router;
