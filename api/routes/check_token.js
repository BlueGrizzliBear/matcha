var express = require('express');
var router = express.Router();
var checkToken = require('./middleware');

// Profile function to return true or false if profile is complete or not
function isProfileComplete(user) {
  if (user.firstname === 'admin')
    return (true);
  return (false);
}

/* POST  */
router.post('/', checkToken, function (req, res, next) {
  console.log("Token is valid: sending user informations")
  res.status(200).json({
    status: "200",
    isAuth: true,
    isProfileComplete: (isProfileComplete(res.locals.results)),
    id: res.locals.decoded.id,
    username: res.locals.decoded.username,
    email: res.locals.decoded.email,
    firstname: res.locals.decoded.firstname,
    lastname: res.locals.decoded.lastname,
    isActivated: res.locals.decoded.activated,
    gender: res.locals.decoded.gendfer,
    preference: resres.locals.decodedults.preference,
    bio: res.locals.decoded.bio,
    profile_path: 'upload/' + res.locals.decoded.profile_path,
    img1_path: 'upload/' + res.locals.decoded.img1_path,
    img2_path: 'upload/' + res.locals.decoded.img2_path,
    img3_path: 'upload/' + res.locals.decoded.img3_path,
    img4_path: 'upload/' + res.locals.decoded.img4_path
  }).end();
});

module.exports = router;
