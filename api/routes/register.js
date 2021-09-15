var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');
const connection = require('../config/db');
var TokenDB = require('./query');
var Models = require('../models/model');
// var deleteTokenDB = require('./query');
// var selectTokenDB = require('./query');

/*
	Here we are configuring our SMTP Server details.
	STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	requireTLS: true,
	auth: {
		user: "matcha.project.noreply@gmail.com",
		pass: process.env.GMAIL_APP_PASS
	}
});
/*------------------SMTP Over-----------------------------*/


/* Sending link in email to user to verify account */
const sendLinkVerification = function (req, res) {
	// const user = new Token();

	const token = jwt.sign({ id: req.body.id, email: req.body.email, host: req.get('host') }, process.env.SECRET_LINK, {
		expiresIn: '10m'
	});
	token
	if (TokenDB.insertTokenDB(req.body.id, token)) {
		console.log("error occured inserting token in tokens table");
	}
	else {
		// console.log("Get Host: " + req.get('host'));
		// console.log("token: " + token);
		link = "http://" + req.get('host') + "/register/verify?id=" + token;
		var mailOptions = {
			to: req.body.email,
			subject: "Please confirm your Email account",
			html: "Hello " + req.body.username + ",<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
		}
		// console.log(mailOptions);
		smtpTransport.sendMail(mailOptions, function (error, response) {
			if (error) {
				console.log(error);
				res.end("error");
			} else {
				// console.log("Message sent: " + response.message);
				res.end("sent");
			}
		});
	}
}

/* Verify link on user click in email */
const verifyLink = function (req, res) {
	jwt.verify(req.query.id, process.env.SECRET, function (err, decoded) {
		if ((req.protocol + "://" + req.get('host')) == ("http://" + decoded.host)) {
			console.log("Domain is matched. Information is from Authentic email");
			if (err) {
				console.log("email is not verified");
				res.end("<h1>Bad Request</h1>");
			}
			else {
				if (TokenDB.selectTokenDB(decoded.id, req.query.id)) {
					console.log("email is not verified, token already used");
					res.end("<h1>Bad Request</h1>");
				}
				connection.query('UPDATE users SET activated = 1 WHERE id = ? AND email = ?', [decoded.id, decoded.email], async function (error, results, fields) {
					if (error) {
						console.log("error updating database");
						res.end("<h1>Bad Request</h1>");
					}
					else {
						if (results.changedRows === 1) {
							console.log("email is verified, id:" + decoded.id);
							res.end("<h1>Email " + decoded.email + " is been Successfully verified");
							if (TokenDB.deleteTokenDB(decoded.id, req.query.id)) {
								console.log("token already deleted");
							}
						}
						else {
							console.log("email already verified, id:" + decoded.id);
							res.end("<h1>Email " + decoded.email + " is already verified");
						}
					}
				});
			}
		}
		else {
			res.end("<h1>Request is from unknown source");
		}
	});
}

/* registering user in database */
const register = async function (req, res) {
	if (!req.body.password) {
		console.log("Empty password");
		res.status(400).end();
	}
	/* Number of pass to encrypt the user password */
	const saltRounds = 10;
	/* Encrypt password before storing it to database */
	const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);
	/* Create the set to store in database */
	const user_params = {
		"username": req.body.username,
		"email": req.body.email,
		"firstname": req.body.firstname,
		"lastname": req.body.lastname,
		"password": encryptedPassword
	}
	/* Create new user model */
	const user = new Models.User();

	user.create(user_params, function (error, results) {
		if (error) {
			// console.log(error);
			res.status(400).end();
		}
		else {
			req.body.id = results.insertId;
			console.log("User registered sucessfully");
			/* Sending verification link to activate user account */
			sendLinkVerification(req, res);
			res.status(200).end();
		}
	})
}

// POST route to register a user
router.post('/', function (req, res, next) {
	register(req, res);
});

// GET route to verify a link /regsiter/verify
router.get('/verify', function (req, res, next) {
	verifyLink(req, res);
});

// POST route to send a link verification email again /register/send_link
router.post('/send_link', function (req, res, next) {
	// needs user id and user email in req in order to work
	sendLinkVerification(req, res);
});

module.exports = router;
