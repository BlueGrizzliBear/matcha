var express = require('express');
var router = express.Router();
var activation = require("./activation");
var Models = require('../models/models');

/* POST /register - Register a user into database */
router.post('/', function (req, res, next) {
	const user = new Models.User();

	user.create(req.body, function (error, results) {
		if (error) {
			console.log(error);
			res.status((error.code === 'ER_DUP_ENTRY' ? 409 : 400)).end();
		}
		else {
			req.body.id = results.insertId;
			// console.log("User registered sucessfully");
			/* Sending verification link to activate user account */
			activation.sendLinkVerification(req, res);
			res.status(200).end();
		}
	})
});

/* GET /regsiter/verify?id=token - Verify a generated token link to verify user email */
router.get('/verify', function (req, res, next) {
	activation.verifyLink(req, res);
});

/* GET /regsiter/revert_email?id=token - Verify a generated token link to revert user email to his previous email */
router.get('/revert', function (req, res, next) {
	activation.verifyLink(req, res);
});

module.exports = router;
