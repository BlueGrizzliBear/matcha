var mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'db',
	user: 'root',
	password: 'root',
	database: 'matcha_db'
}).on('error', function (err) {
	throw err.code; // 'ER_BAD_DB_ERROR'
});

module.exports = connection;
