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
    res.status(401);
  }
  else {
    const token = bearerToken.split(' ')[1]
    console.log("token:" + token);
    if (token) {
      jwt.verify(token, process.env.SECRET, function (err, decoded) {
        console.log(err);
        if (err) {
          console.log("Unauthorized: Invalid token");
          res.status(401);
        }
        else {
          req.id = decoded.id;
          // verifier le format des elements decodés
          connection.query('SELECT * FROM users WHERE id = ? AND email = ? ', [decoded.id, decoded.email], async function (error, results, fields) {
            if (error) {
              console.log(error);
              res.status(400);
            }
            else {
              console.log(results)
              if (!results[0]) {
                console.log("Unauthorized: Invalid token");
                res.status(401);
              }
              else {
                res.status(200).json({
                  status: "200",
                  isAuth: true,
                  isActivated: (results[0].activated ? true : false),
                  isProfileComplete: (isProfileComplete(results[0]))
                });
              }
            }
          });
        }
      });
    }
    else {
      console.log("null token");
      res.status(401);
    }
  }
}

// Profile function to return true or false if profile is complete or not
function isProfileComplete(user) {
  if (user.firstname === 'admin')
    return (true);
  return (false);
}

/* GET home page. */
router.post('/', withAuth, function (req, res, next) {
  // res.status(200).send("ok");
});

module.exports = router;
