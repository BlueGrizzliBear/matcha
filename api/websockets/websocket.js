var Models = require('../models/models');
const ws = require('ws');

var wss = new ws.WebSocketServer({
	noServer: true
});

const authenticate = (request, err) => {
	console.log(`Conn Url ${request.url}`);
	const token = new Models.Token(null, request.url.substring(8))
	token.verify(function (error, decoded) {
		if (error) {
			err("Unauthorized: Invalid token", null);
		}
		else {
			token.find(function (finderror, findresults) {
				if (finderror) {
					err("Unauthorized: Token is revoked", null);
				}
				else {
					err(null, { id: decoded.id, username: decoded.username })
				}
			});
		}
	});
}

// ws://localhost:9000
wss.on('connection', function (ws, request, client) {
	ws.id = client.id;
	ws.username = client.username;
	ws.on('message', function message(msg) {
		// if message reveivec isOnline => send message to all conversations and watching person to see online
		console.log(`Received message ${msg} from user ${client}`);
	});
	ws.on('close', function close() {
		// send message to all conversations and watching person to see offline
		console.log(`Socket connection closed from user ${client}`);
	});
});

const sendNotification = function (userId, type, from, message = null) {
	wss.clients.forEach((client) => {
		console.log(client.id);
		// Check that connect are open and still alive to avoid socket error
		if (client.readyState === 1 && client.id === userId) {
			if (type == 1)
				client.send("New Message");
			else if (type == 2)
				client.send("New Like");
			else if (type == 3)
				client.send("New Watch");
			else if (type == 4)
				client.send("New Unlike");
		}
	});
}

const sendChat = function (userId, read, from, message = null) {
	wss.clients.forEach((client) => {
		console.log(client.id);
		// Check that connect are open and still alive to avoid socket error
		if (client.readyState === 1 && client.id === userId) {
			client.send("New Message");
		}
	});
}

module.exports = { authenticate, sendNotification, sendChat, wss };
