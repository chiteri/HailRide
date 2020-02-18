const express  = require("express"), 
	  passport = require("passport"),
	  User     = require("../models/user"),
	  middleware = require("../middleware");
	  
var router = express.Router();

// A middleware function to include a new user's data to each page
router.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

// The landing page
router.get("/", (req, res) => {
	res.render("login");
});

// =============
//  AUTH ROUTES
// =============
// The user registration page
router.get("/register", (req, res) => {
	res.render("register");
});

// Handle sign up logic
router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			console.log(err);
			return res.render("register");
		}
		// Else authenticate the new user
		passport.authenticate("local")(req, res, () => {
			res.redirect("/home");
		});
	});
});

// Show login form 
router.get("/login", (req, res) => {
	res.render("login");
});

// Handling login logic
router.post("/login", passport.authenticate("local", {
		successRedirect: "/home",
		failureRedirect: "/login"
	}), (req, res) => {
});

// The landing page for a logged in user
router.get("/home", middleware.isLoggedIn, (req, res) => {
	res.render("home");
});

// Logout logic
router.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/login");
});

// * Catch-all route matcher (Everything else)
router.get("*", (req, res) => {
	res.send("Howdy? What are you doing with your life?");
});

module.exports = router;