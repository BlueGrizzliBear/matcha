var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
// var nodemailer = require("nodemailer");

// /*
// 	Here we are configuring our SMTP Server details.
// 	STMP is mail server which is responsible for sending and recieving email.
// */
// var smtpTransport = nodemailer.createTransport("SMTP", {
// 	service: "Gmail",
// 	auth: {
// 		user: "tsanuta",
// 		pass: process.env.GMAIL_APP_PASS
// 	}
// });
// /*------------------SMTP Over-----------------------------*/

// var rand, mailOptions, host;

// /* sending mail */
// const sendLinkVerification = function (req, res) {
// 	rand = Math.floor((Math.random() * 100) + 54);
// 	host = req.get('host');
// 	link = "http://" + req.get('host') + "/verify?id=" + rand; mailOptions = {
// 		to: req.query.to,
// 		subject: "Please confirm your Email account",
// 		html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
// 	}
// 	console.log(mailOptions);
// 	smtpTransport.sendMail(mailOptions, function (error, response) {
// 		if (error) {
// 			console.log(error);
// 			res.end("error");
// 		} else {
// 			console.log("Message sent: " + response.message);
// 			res.end("sent");
// 		}
// 	});
// }

// /* verify link */
// const verifyLink = function (req, res) {
// 	if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
// 		console.log("Domain is matched. Information is from Authentic email");
// 		if (req.query.id == rand) {
// 			console.log("email is verified");
// 			res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
// 		}
// 		else {
// 			console.log("email is not verified");
// 			res.end("<h1>Bad Request</h1>");
// 		}
// 	}
// 	else {
// 		res.end("<h1>Request is from unknown source");
// 	}
// }

/* registering user in database */
const register = async function (req, res) {
	var connection = mysql.createConnection({
		host: 'db',
		user: 'root',
		password: 'root',
		database: 'matcha_db'
	});
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
			res.status(400).json({
				status: "400",
				failed: "error occurred",
				error: error
			})
		}
		else {
			console.log("user registered sucessfully");
			// sendLinkVerification(req, res);
			res.status(200).json({
				status: "200",
				success: "user registered sucessfully"
			})
		}
	});
}

// POST route to register a user
router.post('/', function (req, res, next) {
	register(req, res);
});

module.exports = router;
