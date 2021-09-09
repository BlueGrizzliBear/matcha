var express = require('express');
var router = express.Router();
var checkToken = require('./middleware');
const multer = require('multer');
const connection = require('./connection');
const fs = require('fs')
var path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log("req.results.username");
        // console.log(req.results.username);
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // console.log("req.results.id");
        // console.log(req.results.id);
        // console.log(typeof (req.results.id));
        console.log("file");
        console.log(file);
        // console.log(file.fieldname);
        // console.log(file.filename);
        const uniqueSuffix = req.results.id.toString() + Date.now() + '-' + Math.round(Math.random() * 1E9);
        // console.log(uniqueSuffix);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});


router.post('/', checkToken, function (req, res, next) {
    const uploads = multer({ storage: storage });

    req.results = res.locals.results
    const upload = uploads.single('uploadedImage');
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading.");
            console.error(err);
            res.status(400).end();
        }
        else if (err) {
            console.log("An unknown error occurred when uploading.");
            console.error(err);
            res.status(400).end();
        }
        else {
            /* Look for previous profile picture and delete if exists */
            connection.query('SELECT ?? FROM users WHERE id = ? AND email = ?', [req.query.img, res.locals.decoded.id, res.locals.decoded.email], async function (error, results, fields) {
                if (error) {
                    fs.unlink("uploads/" + req.file.filename, (err => {
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
                        fs.unlink("uploads/" + results[0][Object.keys(results[0])[0]], (err => {
                            if (err) console.log(err);
                            else {
                                console.log("\nDeleted file: " + results[0][Object.keys(results[0])[0]]);
                            }
                        }))
                    }
                    connection.query('UPDATE users SET ?? = ? WHERE id = ? AND email = ?', [req.query.img, req.file.filename, res.locals.decoded.id, res.locals.decoded.email], async function (error, results, fields) {
                        if (error) {
                            fs.unlink("uploads/" + req.file.filename, (err => {
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
                            console.log("RESULTS");
                            console.log(results);
                            // Everything went fine.
                            res.status(200).end();
                        }
                    });
                }
            });

        }
    });
});

module.exports = router;
