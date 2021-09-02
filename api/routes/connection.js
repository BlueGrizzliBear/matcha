var mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'db',
	user: 'root',
	password: 'root',
	database: 'matcha_db'
});

module.exports = connection;
