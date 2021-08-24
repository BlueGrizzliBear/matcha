var express = require('express');
var router = express.Router();
var mysql = require('mysql');

// Variable to be sent to Frontend with Database status
let databaseConnection = "Waiting for Database response...";

router.get("/", function(req, res, next) {
    res.send(databaseConnection);
});

// Connecting to MongoDB
// mongoose.connect("mongodb://mongodb:27017/test");
var connection = mysql.createConnection({
  host     : 'db',
  user     : 'root',
  password : 'root'
});

// If there is a connection error send an error message
// mongoose.connection.on("error", error => {
//     console.log("Database connection error:", error);
//     databaseConnection = "Error connecting to Database";
// });
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as to Database as id ' + connection.threadId);
  databaseConnection = "Connected to Database";
});

// If connected to MongoDB send a success message
// mongoose.connection.once("open", () => {
//     console.log("Connected to Database!");
//     databaseConnection = "Connected to Database";
// });

module.exports = router;
