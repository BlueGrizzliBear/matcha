var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');

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
