var express = require('express');
var router = express.Router();
var checkToken = require('./middleware/middleware');
const connection = require('../config/db');

// Profile function to return true or false if profile is complete or not
function profileIsComplete(id, username) {
  connection.query('SELECT * FROM users WHERE id = ? AND username = ?', [id, username], async function (error, results, fields) {
    if (error) {
      console.log(error);
      return false;;
    }
    else {
      if (results.length > 0) {
        if (/*results[0].birth_date && results[0].gender && results[0].bio && */results[0].profile) {
          if (results[0].complete == false) {
            connection.query('UPDATE users SET complete = true WHERE id = ? AND username = ?', [id, username], async function (error, results, fields) {
              if (error) {
                console.log(error);
                return false;;
              }
            })
          }
          return true;
        }
        else {
          if (results[0].complete == true) {
            connection.query('UPDATE users SET complete = false WHERE id = ? AND username = ?', [id, username], async function (error, results, fields) {
              if (error)
                console.log(error);
            })
          }
        }
      }
      return false;
    }
  });
}

/* GET user profile. */
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
  });
});

// /* POST to change user profile. */
// router.post('/', checkToken, function (req, res, next) {
//   /* Update user informations */
//   let user = {
//     preference: req.body.preference,

//   }
//   connection.query('UPDATE users SET ?', [user], async function (error, results, fields) {
//     if (error) {
//       console.log("error occured inserting token in tokens table");
//       console.log(error);
//       return error;
//     }
//     else {
//       console.log("Succefully insert token in tokens database");
//       console.log(results);
//       return false;
//     }
//   });
//   /* return user profile with new changed informations */
//   res.status(200).json({
//     status: "200",
//     isAuth: true,
//     isProfileComplete: /* res.locals.results.complete */true,
//     id: res.locals.results.id,
//     username: res.locals.results.username,
//     email: res.locals.results.email,
//     firstname: res.locals.results.firstname,
//     lastname: res.locals.results.lastname,
//     birth_date: res.locals.results.birth_date,
//     isActivated: res.locals.results.activated,
//     gender: res.locals.results.gendfer,
//     preference: res.locals.results.preference,
//     bio: res.locals.results.bio,
//     profile: res.locals.results.profile_path,
//     img1: res.locals.results.img1_path,
//     img2: res.locals.results.img2_path,
//     img3: res.locals.results.img3_path,
//     img4: res.locals.results.img4_path
//   });
// });

module.exports = { router, profileIsComplete };




// Json = {
//   usename: "salut",
//   ---
//   images: {
//     profile: "url",
//     img1: "url",
//     img2: "url",
//     img3: "url",
//     img4: "url",
//   },
// }