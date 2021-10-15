var express = require('express');
var router = express.Router();
var checkToken = require('../middleware/token');
const uploads = require('../config/uploads');
var Models = require('../models/models');
var validate = require('../models/validate');
var path = require('path');

/* POST /upload?img=img0 - Uploads the user profile images (img0/img1/img2/img3/img4) */
router.post('/', checkToken, function (req, res, next) {
    const fileSize = parseInt(req.headers['content-length']);
    if (fileSize > 7340032) {
        res.status(413).end();
    }
    else if (!req.query.img || !validate.isImageKey(req.query.img + '_path'))
        res.status(400).end();
    else {
        req.results = res.locals.results
        const upload = uploads.single('uploadedImage');
        upload(req, res, function (err) {
            if (err) {
                console.error(err);
                console.log("Error on upload")
                res.status(400).end();
            }
            else if (!(req.file && req.file.filename)) {
                console.log("File does not exist");
                res.status(400).end();
            }
            else {
                const user = new Models.User(res.locals.results.id, res.locals.results.username);
                user.updateImage(req.query.img + '_path', "http://" + req.get('host') + "/upload/" + req.file.filename, (error, results) => {
                    if (error) {
                        console.log("Error on updating image");
                        console.log(error);
                        res.status(400).end();
                    }
                    else {
                        res.status(200).json({
                            image: req.file.filename,
                            isProfileComplete: results
                        }).end();
                    }
                });
            }
        });
    }
});

/* GET /upload/486484844468-485648646846 - Send the asked image */
router.get('/:filename', function (req, res, next) {
    const { filename } = req.params;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, 'user_images/' + filename);
    return res.sendFile(fullfilepath);
});

/* DELETE /upload?img=img0 - Delete the user profile images (img0/img1/img2/img3/img4) */
router.delete('/', checkToken, function (req, res, next) {
    if (!req.query.img && !validate.isImageKey(req.query.img + '_path'))
        res.status(400).end();
    else {
        const user = new Models.User(res.locals.results.id, res.locals.results.username);
        user.deleteImage(req.query.img + '_path', req, (error, results) => {
            if (error) {
                console.log("Error on updating image");
                console.log(error);
                res.status(400).end();
            }
            else
                res.status(200).json({
                    isProfileComplete: results
                }).end();
        });
    }
})

module.exports = router;
