var express = require('express');
var router = express.Router();
var checkToken = require('../middleware/token');
var Models = require('../models/models');

/* GET /user - Send user profile informations */
router.get('/', checkToken, function (req, res, next) {
  res.status(200).json({
    status: "200",
    isAuth: true,
    isProfileComplete: res.locals.results.complete,
    id: res.locals.results.id,
    username: res.locals.results.username,
    email: res.locals.results.email,
    firstname: res.locals.results.firstname,
    lastname: res.locals.results.lastname,
    birth_date: res.locals.results.birth_date,
    isActivated: res.locals.results.activated,
    gender: res.locals.results.gender,
    preference: res.locals.results.preference,
    bio: res.locals.results.bio,
    images: {
      img0: res.locals.results.img0_path,
      img1: res.locals.results.img1_path,
      img2: res.locals.results.img2_path,
      img3: res.locals.results.img3_path,
      img4: res.locals.results.img4_path
    },
    likes: 50, // A FAIRE
    watch: 2 // A FAIRE
  }).end();
});

/* POST /user - Update/change user profile informations */
router.post('/', checkToken, function (req, res, next) {
  /* Update user informations */
  const user = new Models.User(res.locals.results.id, res.locals.results.username);
  user.update(req.body, true, (error, results) => {
    if (error) {
      console.log(error);
      res.status(400).end();
    }
    else {
      user.find((error, results) => {
        /* return user profile with new changed informations */
        res.status(200).json({
          status: "200",
          isAuth: true,
          isProfileComplete: results[0].complete,
          id: results[0].id,
          username: results[0].username,
          email: results[0].email,
          firstname: results[0].firstname,
          lastname: results[0].lastname,
          birth_date: results[0].birth_date,
          isActivated: results[0].activated,
          gender: results[0].gender,
          preference: results[0].preference,
          bio: results[0].bio,
          images: {
            profile: results[0].img0_path,
            img1: results[0].img1_path,
            img2: results[0].img2_path,
            img3: results[0].img3_path,
            img4: results[0].img4_path
          },
          likes: 50, // A FAIRE
          watch: 2 // A FAIRE
        }).end();
      });
    }
  });
});

/* GET /user - Send user profile informations */
router.get('/:username', checkToken, function (req, res, next) {
  const user = new Models.User(null, req.params['username']);
  user.find((error, results) => {
    /* return user profile with new changed informations */
    res.status(200).json({
      status: "200",
      // isAuth: true,
      isProfileComplete: results[0].complete,
      id: results[0].id,
      username: results[0].username,
      email: results[0].email,
      firstname: results[0].firstname,
      lastname: results[0].lastname,
      birth_date: results[0].birth_date,
      isActivated: results[0].activated,
      gender: results[0].gender,
      preference: results[0].preference,
      bio: results[0].bio,
      images: {
        profile: results[0].img0_path,
        img1: results[0].img1_path,
        img2: results[0].img2_path,
        img3: results[0].img3_path,
        img4: results[0].img4_path
      },
      likes: 50, // A FAIRE
      watch: 2 // A FAIRE
    }).end();
  });
});

/* POST /user/reset_password - Verify a generated token link to reset password */
router.post('/reset_password', checkToken, function (req, res, next) {
  // A VOIR COMMENT TRAITER LE RETOUR SUR LE FRONT
  // (lien du mail pointant directement sur le front avec parsing du token dans la querry renvoyé sur la route en back
  // ou lien de mail poitant sur le back et reset sur le back avec redirection sur le front une fois reset)
  const user = new Models.User(res.locals.results.id, res.locals.results.username);
  user.update({ password: req.body.password }, true, (error, results) => {
    if (error) {
      console.log(error);
      res.status(400).end();
    }
    else {
      const token = new Models.Token(res.locals.results.id, res.locals.token);
      token.delete((tokerr, tokres) => {
        if (tokerr) {
          console.log(tokerr);
          res.status(400).end();
        }
        else {
          res.status(200).end();
        }
      });
    }
  });
});

module.exports = router;
