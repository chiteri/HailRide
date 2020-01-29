const express = require("express");

var app = express();
app.set("view engine", "ejs");

// Include a public directory for storing static assets
app.use(express.static("public"));

// The landing page
app.get("/", (req, res) => {
	res.render("login");
});

// The user registration page
app.get("/account/create", (req, res) => {
	res.render("register");
});

// * Catch-all route matcher (Everything else)
app.get("*", (req, res) => {
	res.send("Howdy? What are you doing with your life?");
});


// Tell Express to listen for requests (start server)
app.listen(3000, () => {
	console.log("Ride hailing app's server listening on port 3000");
});