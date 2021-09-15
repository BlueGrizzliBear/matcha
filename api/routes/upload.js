var express = require('express');
var router = express.Router();
var checkToken = require('./middleware/middleware');
const multer = require('multer');
const connection = require('../config/db');
const fs = require('fs');
var path = require('path');
var user = require('./user');

// var issueUserToken = require('./token');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log("req.results.username");
        // console.log(req.results.username);
        cb(null, 'user_images/');
    },
    filename: (req, file, cb) => {
        // console.log("req.results.id");
        // console.log(req.results.id);
        // console.log(typeof (req.results.id));
        // console.log("file");
        // console.log(file);
        // console.log(file.fieldname);
        // console.log(file.filename);
        const uniqueSuffix = req.results.id.toString() + Date.now() + '-' + Math.round(Math.random() * 1E9);
        // console.log(uniqueSuffix);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


router.post('/', checkToken, function (req, res, next) {
    const whitelist = [
        'image/png',
        'image/jpeg',
        'image/jpg'
    ];

    const uploads = multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            if (!whitelist.includes(file.mimetype)) {
                return cb(new Error('file is not allowed'));
            }
            cb(null, true);
        }
    });

    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize > 7340032) {
        res.status(413).end();
    }
    else {
        req.results = res.locals.results
        const upload = uploads.single('uploadedImage');
        upload(req, res, function (err) {
            if (err) {
                console.error(err);
                res.status(400).end();
            }
            else if (!(req.file && req.file.filename)) {
                console.log("file does not exist");
                res.status(400).end();
            }
            else {
                /* Look for previous profile picture and delete if exists */
                //   CHECK LA QUERY pour correspondance au format voulu

                connection.query('SELECT ?? FROM users WHERE id = ? AND email = ?', [req.query.img + '_path', res.locals.decoded.id, res.locals.decoded.email], async function (error, results, fields) {
                    if (error) {
                        fs.unlink("user_images/" + req.file.filename, (err => {
                            if (err) console.log(err);
                            else {
                                console.log("\nDeleted file: " + req.file.filename);
                            }
                        }))
                        console.log("Error connecting with database");
                        console.error(error);
                        res.status(400).end();
                    }
                    else {
                        if (results[0][Object.keys(results[0])[0]]) {
                            fs.unlink("user_images/" + results[0][Object.keys(results[0])[0]], (err => {
                                if (err) console.log(err);
                                else {
                                    console.log("\nDeleted file: " + results[0][Object.keys(results[0])[0]]);
                                }
                            }))
                        }
                        connection.query('UPDATE users SET ?? = ? WHERE id = ? AND email = ?', [req.query.img + '_path', req.file.filename, res.locals.decoded.id, res.locals.decoded.email], async function (error, results, fields) {
                            if (error) {
                                fs.unlink("user_images/" + req.file.filename, (err => {
                                    if (err) console.log(err);
                                    else {
                                        console.log("\nDeleted file: " + req.file.filename);
                                    }
                                }))
                                console.log("error updating database");
                                console.error(error);
                                res.status(400).end();
                            }
                            else {
                                console.log("Image is uploaded on server and database");
                                // console.log(results);
                                // Update token with informations
                                // Issue token updated new user token
                                // var user = issueUserToken(res.locals.results);
                                res.status(200).json({ image: req.file.filename }).end();
                            }
                        });
                    }
                });

            }
        });
    }
});

router.get('/:filename', checkToken, function (req, res, next) {
    const { filename } = req.params;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, 'user_images/' + filename);
    return res.sendFile(fullfilepath);
});

router.delete('/', checkToken, function (req, res, next) {
    // CHECK LE FORMAT DE LA QUERRY POUR SQL INJECTION [profile, img1, img2, img3, img4]
    connection.query('SELECT ?? FROM users WHERE id = ? AND email = ?', [req.query.img + '_path', res.locals.decoded.id, res.locals.decoded.email], async function (error, results, fields) {
        if (error) {
            console.log("Error connecting with database");
            console.error(error);
            res.status(400).end();
        }
        else {
            if (results[0][Object.keys(results[0])[0]]) {
                console.log(results[0][Object.keys(results[0])[0]]);
                fs.unlink("user_images/" + results[0][Object.keys(results[0])[0]], (err => {
                    if (err) console.log(err);
                    else {
                        console.log("\nDeleted file");
                    }
                }))
                connection.query('UPDATE users SET ?? = NULL WHERE id = ? AND email = ?', [req.query.img + "_path", res.locals.decoded.id, res.locals.decoded.email], async function (error, results, fields) {
                    if (error) {
                        console.log("Error connecting with database");
                        console.error(error);
                        res.status(400).end();
                    }
                    else {
                        if (req.query.img == "img0") {
                            console.log("check if profile is complete");
                            user.profileIsComplete(res.locals.decoded.id, res.locals.decoded.username);
                            res.status(200).end();
                        }
                        res.status(400).end();
                    }
                });
            }
            else {
                res.status(400).end();
            }
        }
    });
})

module.exports = router;
