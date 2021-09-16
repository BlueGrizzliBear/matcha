var express = require('express');
var router = express.Router();
var checkToken = require('../middleware/token');

/* GET /user - Send user profile informations */
router.get('/', checkToken, function (req, res, next) {
  res.status(200).json({
    status: "200",
    isAuth: true,
    isProfileComplete: res.locals.results.complete, /* false initially */
    id: res.locals.results.id,
    username: res.locals.results.username,
    email: res.locals.results.email,
    firstname: res.locals.results.firstname,
    lastname: res.locals.results.lastname,
    birth_date: res.locals.results.birth_date,
    isActivated: res.locals.results.activated,
    gender: res.locals.results.gendfer,
    preference: res.locals.results.preference,
    bio: res.locals.results.bio,
    images: {
      img0: res.locals.results.img0_path,
      img1: res.locals.results.img1_path,
      img2: res.locals.results.img2_path,
      img3: res.locals.results.img3_path,
      img4: res.locals.results.img4_path
    }
  }).end();
});

/* POST /user - Update/change user profile informations */
router.post('/', checkToken, function (req, res, next) {
  /* Update user informations */
  let set = req.body;
  const user = new Models.User(res.locals.results.id, res.locals.results.username);
  user.update(set, async (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(400).end();
    }
    else {
      // console.log(results);
      /* return user profile with new changed informations */
      res.status(200).json({
        status: "200",
        isAuth: true,
        isProfileComplete: results.complete,
        id: results.id,
        username: results.username,
        email: results.email,
        firstname: results.firstname,
        lastname: results.lastname,
        birth_date: results.birth_date,
        isActivated: results.activated,
        gender: results.gendfer,
        preference: results.preference,
        bio: results.bio,
        images: {
          profile: results.img0_path,
          img1: results.img1_path,
          img2: results.img2_path,
          img3: results.img3_path,
          img4: results.img4_path
        }
      }).end();
    }
  });
});

module.exports = router;
