const connection = require('./connection');


const insertTokenDB = function (user, token) {
	connection.query('INSERT INTO tokens (token) VALUES (?)', [token], async function (error, results, fields) {
		if (error) {
			console.log("error occured inserting token in tokens table");
			console.log(error);
			return error;
		}
		else {
			console.log(results)
			let token_user = {
				user_id: user,
				token_id: results.insertId,
			}
			connection.query('INSERT INTO token_user SET ?', [token_user], async function (error, results, fields) {
				if (error) {
					console.log("error occured inserting token and user id in token_user table");
					console.log(error);
					return error;
				}
				else {
					return;
				}
			});
		}
	});
}

// const selectTokenDB = function (token) {
// 	connection.query('SELECT token FROM token_user WHERE token = ?', [token], async function (error, results, fields) {
// 		if (error) {
// 			console.log("error occured inserting token in tokens table");
// 			console.log(error);
// 			return error;
// 		}
// 		else {
// 			if (results.length > 0) {
// 				return false;
// 			}
// 			return true;
// 		}
// 	});
// }

// const deleteTokenDB = function (token) {
// 	connection.query('DELETE FROM token_user WHERE token = ?', [token], async function (error, results, fields) {
// 		if (error) {
// 			console.log("error occured inserting token in tokens table");
// 			console.log(error);
// 			return error;
// 		}
// 		else {
// 			return false;
// 		}
// 	});
// }

module.exports = insertTokenDB;
