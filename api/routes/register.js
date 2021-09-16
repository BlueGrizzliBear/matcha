var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
var Models = require('../models/models');

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
	/* Creat a new token model based on user id */
	const token = new Models.Token(req.body.id);
	/* Generate a token and save to database */
	token.generate({ id: req.body.id, username: req.body.username, email: req.body.email, host: req.get('host') }, '10m', function (error, results) {
		if (error)
			console.log(error);
		else {
			link = "http://" + req.get('host') + "/register/verify?id=" + token.getToken();
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
	});
}

/* Verify link on user click in email */
const verifyLink = function (req, res) {
	const token = new Models.Token(null, req.query.id);

	token.verify(function (err, decoded) {
		if (err) {
			console.log("email is not verified");
			res.end("<h1>Bad Request</h1>");
		}
		else {
			if ((req.protocol + "://" + req.get('host')) == ("http://" + decoded.host))
				console.log("Domain is matched. Information is from Authentic email");
			else
				res.end("<h1>Request is from unknown source");
			token.find(function (findError, results) {
				if (findError) {
					console.log("Email is not verified, token already used");
					res.end("<h1>Bad Request</h1>");
				}
				else {
					const user = new Models.User(decoded.id, decoded.username);
					user.update({ activated: 1 }, function (updateError, results) {
						if (updateError) {
							console.log("error updating database");
							res.end("<h1>Bad Request</h1>");
						}
						else {
							if (results.changedRows === 1) {
								res.end("<h1>Email " + decoded.email + " is been Successfully verified");
								token.delete(function (deleteError, results) {
									if (deleteError)
										console.log("Token already deleted");
								});
							}
							else {
								console.log("email already verified, id:" + decoded.id);
								res.end("<h1>Email " + decoded.email + " is already verified");
							}
						}
					});
				}
			});
		}
	});
}

/* registering user in database */
const register = async function (req, res) {
	if (!req.body.password || typeof req.body.password !== 'string') {
		console.log("Empty password");
		res.status(400).end();
	}
	else {
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
}

/* POST /register - Register a user into database */
router.post('/', function (req, res, next) {
	register(req, res);
});

/* GET /regsiter/verify?id=token - Verify a generated token link to verify user email */
router.get('/verify', function (req, res, next) {
	verifyLink(req, res);
});

/* POST /register/send_link - Send an email link verification again */
router.post('/send_link', function (req, res, next) {
	// needs user id and user email in req in order to work
	sendLinkVerification(req, res);
});

module.exports = router;
