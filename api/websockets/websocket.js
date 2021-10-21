const Models = require('../models/models');
const ws = require('ws');

const wss = new ws.WebSocketServer({
	noServer: true
});

const authenticate = (request, err) => {
	console.log(`Websocket connexion Url ${request.url}`);
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
	ws.watchlist = [];

	addFriendsWatchlist(ws).then(v => {
		sendFriends(ws.id, { type: "Online", user: ws.id, online: true });

		ws.on('message', function message(msg) {
			// console.log(`Received message ${msg} from user ${client.id}`);
			msg = JSON.parse(msg);
			// {isUserOline: id} => send specific user is online or not
			if (msg.isUserOnline)
				isUserOnline(ws, msg.isUserOnline)
			// {watching: id}
			if (msg.watching)
				ws.watchlist.push(msg.watching);
		});
		ws.on('close', function close() {
			sendFriends(ws.id, { type: "Online", user: ws.id, online: false });
			// send message to all clients conversations and watching person to see offline
			console.log(`Socket connection closed from user ${client.id}`);
		});
	});
});

const isUserOnline = function (ws, id) {
	for (let client of wss.clients) {
		if (client.readyState === 1 && client.id === id) {
			ws.send(JSON.stringify({ type: "Online", user: id, online: true }))
			return;
		}
	}
	ws.send(JSON.stringify({ type: "Online", user: id, online: false }))
	return;
}

const addFriendsWatchlist = async function (ws) {
	const friends = new Models.Chat(ws.id, null);
	friends.find((error, results) => {
		if (error) {
			console.log("Cannot add friends to watchlist");
			return new Promise(resolve => {
				resolve(true);
			});
		}
		else {
			for (let conv of results)
				ws.watchlist.push(conv.sender_user_id == ws.id ? conv.receiver_user_id : conv.sender_user_id);
			return new Promise(resolve => {
				resolve(true);
			});
		}
	});
}

const sendFriends = function (userId, message) {
	wss.clients.forEach((client) => {
		if (client.readyState === 1/* && client.id === userId*/) {
			for (let friends of client.watchlist) {
				if (userId === friends) {
					client.send(JSON.stringify(message));
				}
			}
		}
	});
}

const sendNotification = function (userId, type, from, message = null) {
	wss.clients.forEach((client) => {
		// console.log(client.id);
		// Check that connect are open and still alive to avoid socket error
		if (client.readyState === 1 && client.id === userId) {
			if (type == 1)
				client.send(JSON.stringify({ type: "Notification Message" }));
			else if (type == 2)
				client.send(JSON.stringify({ type: "Notification Like" }));
			else if (type == 3)
				client.send(JSON.stringify({ type: "Notification Watch" }));
			else if (type == 4)
				client.send(JSON.stringify({ type: "Notification Unlike" }));
		}
	});
}

const sendChat = function (userId, from, msg) {
	wss.clients.forEach((client) => {
		console.log(client.id);
		// Check that connect are open and still alive to avoid socket error
		if (client.readyState === 1 && client.id === userId) {
			client.send(JSON.stringify({ type: "Message", id: from, msg: msg }));
		}
	});
}

module.exports = { authenticate, sendNotification, sendChat, wss };
