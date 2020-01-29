const express = require("express");

var app = express();

// The landing page
app.get("/", (req, res) => {
	res.send("Welcome to the ride hailing app!");
});

// * Catch-all route matcher (Everything else)
app.get("*", (req, res) => {
	res.send("Howdy? What are you doing with your life?");
});


// Tell Express to listen for requests (start server)
app.listen(3000, () => {
	console.log("Ride hailing app's server listening on port 3000");
});