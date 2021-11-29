var smtpTransport = require("../config/nodemailer");
var Models = require('../models/models');

/* Sending link in email to user to verify account */
const sendLinkVerification = function (req, res) {
	/* Creat a new token model based on user id */
	const token = new Models.Token(req.body.id);
	/* Generate a token and save to database */
	token.generate({ id: req.body.id, username: req.body.username, email: req.body.email, host: req.get('host'), revert: false }, '10m', function (error, results) {
		if (error)
			console.log(error);
		else {
			link = "http://" + req.get('host') + "/register/verify?id=" + token.getToken();
			var mailOptions = {
				to: req.body.email,
				subject: "Please confirm your Email account",
				html: "Hello " + req.body.username + ",<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
			}
			smtpTransport.sendMail(mailOptions, function (error, response) {
				if (error) {
					console.log(error);
					res.end("error");
				} else {
					res.end("sent");
				}
			});
		}
	});
}

/* Sending link in email to user to verify account */
const sendRevertEmail = function (req, res, prevEmail) {
	/* Creat a new token model based on user id */
	const token = new Models.Token(req.body.id);
	/* Generate a token and save to database */
	token.generate({ id: req.body.id, username: req.body.username, email: prevEmail, host: req.get('host'), revert: true }, '1y', function (error, results) {
		if (error)
			console.log(error);
		else {
			link = "http://" + req.get('host') + "/register/verify?id=" + token.getToken();
			var mailOptions = {
				to: prevEmail,
				subject: "Your Email on your Matcha account has been changed",
				html: "Hello " + req.body.username + ",<br> Your Matcha account email has been changed to " + req.body.email + ". If you're not responsible for this change please click the link below.<br><a href=" + link + ">Click here to revert Matcha account email to this email</a>"
			}
			smtpTransport.sendMail(mailOptions, function (error, response) {
				if (error) {
					console.log(error);
					res.end("error");
				} else {
					res.end("sent");
				}
			});
		}
	});
}

/* Sending link in email to reset password account */
const sendPasswordResetLink = function (req, res) {
	/* Creat a new token model based on user id */
	const token = new Models.Token(req.body.id);
	/* Generate a token and save to database */
	token.generate({ id: req.body.id, username: req.body.username, email: req.body.email, host: req.get('host') }, '10m', function (error, results) {
		if (error) {
			console.log(error);
			res.end("error");
		}
		else {
			link = "http://" + process.env.CLIENT_URL + "reset_password/" + token.getToken();
			var mailOptions = {
				to: req.body.email,
				subject: "Matcha : reset account password",
				html: "Hello " + req.body.username + ",<br> Please Click on the link to reset your account password.<br><a href=" + link + ">Click here to reset account password</a>"
			}
			smtpTransport.sendMail(mailOptions, function (error, response) {
				if (error) {
					console.log(error);
					res.end("error");
				} else {
					res.end("sent");
				}
			});
		}
	});
}

/* Verify link on user click in email */
const verifyLink = function (req, res) {
	const token = new Models.Token(null, req.query.id);
	const meta = "<meta http-equiv=\"refresh\" content=\"2; URL=http://" + process.env.CLIENT_URL + "login\" />"

	token.verify(function (err, decoded) {
		if (err) {
			console.log("email is not verified");
			res.end("<h1>Link is not valid anymore</h1>" + meta);
		}
		else {
			if ((req.protocol + "://" + req.get('host')) == ("http://" + decoded.host))
				console.log("Domain is matched. Information is from Authentic email");
			else
				res.end("<h1>Request is from unknown source</h1>" + meta);
			token.find(function (findError, results) {
				if (findError) {
					console.log("Email is already verified, token already used");
					res.end("<h1>Email " + decoded.email + " is already verified</h1>" + meta);
				}
				else {
					const user = new Models.User(decoded.id, decoded.username);
					user.update({ activated: 1, email: decoded.email }, false, function (updateError, results) {
						if (updateError) {
							console.log("error updating database");
							res.end("<h1>An error occured please try again later</h1>" + meta);
						}
						else {
							if (results.changedRows > 0 && decoded.revert === true) {
								res.end("<h1>Email " + decoded.email + " has been Successfully changed back</h1>" + meta);
								token.delete(function (deleteError, results) {
									if (deleteError)
										console.log("Token already deleted");
								});
							}
							else if (results.changedRows > 0 && decoded.revert === false) {
								res.end("<h1>Email " + decoded.email + " is been Successfully verified</h1>" + meta);
								token.revokeAllUserTokens(function (deleteError, results) {
									if (deleteError)
										console.log("Token already deleted");
								});
							}
							else {
								console.log("email already verified, id:" + decoded.id);
								res.end("<h1>Email " + decoded.email + " is already verified</h1>" + meta);
							}
						}
					});
				}
			});
		}
	});
}

module.exports = { sendLinkVerification, sendRevertEmail, verifyLink, sendPasswordResetLink };
