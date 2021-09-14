const connection = require('./connection');


const insertTokenDB = function (userid, token) {
	connection.query('INSERT INTO tokens (user_id, token) VALUES (?, ?)', [userid, token], async function (error, results, fields) {
		if (error) {
			console.log("error occured inserting token in tokens table");
			console.log(error);
			return error;
		}
		else {
			console.log("Succefully insert token in tokens database");
			console.log(results);
			return false;
		}
	});
}

const selectTokenDB = function (userid, token) {
	connection.query('SELECT * FROM tokens WHERE user_id = ? AND token = ?', [userid, token], async function (error, results, fields) {
		if (error) {
			console.log("error occured selecting token in tokens table");
			console.log(error);
			return error;
		}
		else {
			if (results.length > 0) {
				return false;
			}
			return true;
		}
	});
}

const deleteTokenDB = function (userid, token) {
	connection.query('DELETE FROM tokens WHERE user_id = ? AND token = ?', [userid, token], async function (error, results, fields) {
		if (error) {
			console.log("error occured erasing token in tokens table");
			console.log(error);
			return error;
		}
		else {
			return false;
		}
	});
}

const deleteAllUserTokenDB = function (userid) {
	connection.query('DELETE FROM tokens WHERE user_id = ?', [userid], async function (error, results, fields) {
		if (error) {
			console.log("error occured erasing token in tokens table");
			console.log(error);
			return error;
		}
		else {
			return false;
		}
	});
}

const insert = function (table, keys, values) {
	connection.query('INSERT INTO ?? (??) VALUES (?)', [table, keys, values], async function (error, results, fields) {
		if (error) {
			console.log("error occured inserting token in tokens table");
			console.log(error);
			return error;
		}
		else {
			console.log("Succefully insert token in tokens database");
			console.log(results);
			return false;
		}
	});
}

// const deleteRow = function (table, set) {
// 	connection.query('DELETE FROM ?? WHERE ?', [table, set], async function (error, results, fields) {
// 		if (error) {
// 			console.log("error occured erasing token in tokens table");
// 			console.log(error);
// 			return error;
// 		}
// 		else {
// 			return false;
// 		}
// 	});
// }

module.exports = { insertTokenDB, selectTokenDB, deleteTokenDB, deleteAllUserTokenDB, insert };