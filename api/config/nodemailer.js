var nodemailer = require("nodemailer");

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

module.exports = smtpTransport;
