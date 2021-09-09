var express = require('express');
var router = express.Router();
var checkToken = require('./middleware');

// Profile function to return true or false if profile is complete or not
function isProfileComplete(user) {
  if (user.firstname === 'admin')
    return (true);
  return (false);
}

/* GET home page. */
router.post('/', checkToken, function (req, res, next) {
  console.log("Token is valid: sending user informations")
  res.status(200).json({
    status: "200",
    isAuth: true,
    isActivated: (res.locals.results.activated ? true : false),
    isProfileComplete: (isProfileComplete(res.locals.results))
  }).end();
});

module.exports = router;
