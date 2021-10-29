var express = require('express');
var router = express.Router();
var checkToken = require('../middleware/token');
var Models = require('../models/models');
const websocket = require('../websockets/websocket.js');

/* GET /chat - Send user existing chats conversations */
router.get('/', checkToken, function (req, res, next) {
	const chat = new Models.Chat(res.locals.results.id);

	chat.find((error, results) => {
		if (error) {
			console.log(error);
			res.status(400).end();
		}
		else {
			res.status(200).json(results).end();
		}
	})
});

/* GET /chat/:id - Send specific user conversation (last 100 messages) and set read on last message */
router.get('/:id', checkToken, function (req, res, next) {
	const chat = new Models.Chat(res.locals.results.id, parseInt(req.params['id']));

	chat.setMessageRead((merr, fres) => {
		if (merr) {
			console.log(merr);
			res.status(400).end();
		}
		else {
			chat.findConversation((error, results) => {
				if (error) {
					console.log(error);
					res.status(400).end();
				}
				else {
					if (fres.changedRows)
						websocket.sendChat(parseInt(req.params['id']), res.locals.results.id, 'msgread');
					res.status(200).json(results).end();
				}
			});
		}
	});
});

/* POST /chat/:id/send - Send a message to a user */
router.post('/:id/send', checkToken, function (req, res, next) {

	const like = new Models.Like(res.locals.results.id, parseInt(req.params['id']));
	like.liking((likingerr, likingres) => {
		if (likingerr) {
			console.log(likingerr);
			res.status(400).end();
		}
		else {
			like.liked((likederr, likedres) => {
				if (likederr) {
					console.log(likederr);
					res.status(400).end();
				}
				else {
					if (likingres && likedres) {
						const chat = new Models.Chat(res.locals.results.id, parseInt(req.params['id']));

						chat.create(req.body.message, (error, results) => {
							if (error) {
								console.log(error);
								res.status(400).end();
							}
							else {
								const notification = new Models.Notification(parseInt(req.params['id']), 1, results.insertId);
								notification.create((nerr, nres) => {
									if (nerr) {
										console.log(nerr);
										res.status(400).end();
									}
									else {
										websocket.sendNotification(parseInt(req.params['id']), 1);
										websocket.sendChat(parseInt(req.params['id']), res.locals.results.id, results.message);
										res.status(200).end();
									}
								});
							}
						});
					}
					else
						res.status(400).end();
				}

			});
		}
	});
});

module.exports = router;
