function originIsAllowed(origin) {
	console.log("Check client origin");
	// put logic here to detect whether the specified origin is allowed.
	return true;
}

// ws://localhost:9000
function handleConnection(request) {
	var connection = request.accept(null, request.origin);
	console.log((new Date()) + ' Connection accepted.');
	connection.on('message', function (message) {
		if (message.type === 'utf8') {
			var data = JSON.parse(message.utf8Data)
			console.log('Received Message: ' + data.msg);
			connection.sendUTF(data.msg);
		}
		else if (message.type === 'binary') {
			console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
			connection.sendBytes(message.binaryData);
		}
	});
	connection.on('close', function (reasonCode, description) {
		console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
	});
}

module.exports = { originIsAllowed, handleConnection };
