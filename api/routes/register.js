var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
var jwt = require('jsonwebtoken');
const connection = require('./connection');
var insertTokenDB = require('./query');

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


/* sending mail */
const sendLinkVerification = function (req, res) {
	const token = jwt.sign({ id: req.body.id, email: req.body.email, host: req.get('host') }, process.env.SECRET_LINK, {
		expiresIn: '10m'
	});
	if (insertTokenDB(req.body.id, token)) {
		console.log("error occured inserting token in tokens table");
	}
	else {
		console.log("Get Host: " + req.get('host'));
		console.log("token: " + token);
		link = "http://" + req.get('host') + "/register/verify?id=" + token;
		var mailOptions = {
			to: req.body.email,
			subject: "Please confirm your Email account",
			html: "Hello " + req.body.username + ",<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
		}
		console.log(mailOptions);
		smtpTransport.sendMail(mailOptions, function (error, response) {
			if (error) {
				console.log(error);
				res.end("error");
			} else {
				console.log("Message sent: " + response.message);
				res.end("sent");
			}
		});
	}
}

/* verify link */
const verifyLink = function (req, res) {
	jwt.verify(req.query.id, process.env.SECRET, function (err, decoded) {
		if ((req.protocol + "://" + req.get('host')) == ("http://" + decoded.host)) {
			console.log("Domain is matched. Information is from Authentic email");
			if (err) {
				console.log("email is not verified");
				res.end("<h1>Bad Request</h1>");
			}
			else {
				connection.query('UPDATE users SET activated = 1 WHERE id = ? AND email = ?', [decoded.id, decoded.email], async function (error, results, fields) {
					if (error) {
						console.log("error updating database");
						res.end("<h1>Bad Request</h1>");
					}
					else {
						if (results.changedRows === 1) {
							console.log("email is verified, id:" + decoded.id);
							res.end("<h1>Email " + decoded.email + " is been Successfully verified");
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
	const saltRounds = 10;
	const password = req.body.password;
	const encryptedPassword = await bcrypt.hash(password, saltRounds)
	let users = {
		"username": req.body.username,
		"email": req.body.email,
		"firstname": req.body.firstname,
		"lastname": req.body.lastname,
		"password": encryptedPassword
	}
	console.log(users);
	connection.query('INSERT INTO users SET ?', users, function (error, results, fields) {
		if (error) {
			console.log("error occured");
			res.status(400).end();
		}
		else {
			req.body.id = results.insertId;
			console.log("user registered sucessfully");
			sendLinkVerification(req, res);
			res.status(200).end();
		}
	});
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
