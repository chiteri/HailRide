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
	res.render("register", {page: 'register'});
});

// Handle sign up logic
router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user) => {
		if(err) {
			// req.flash("error", err);
			// return res.redirect("/register");
			return res.render("register", {error: err.message});
		}
		// Else authenticate the new user
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to Hail-A-Ride "+user.username+"!!");
			res.redirect("/home");
		});
	});
});

// Show login form 
router.get("/login", (req, res) => {
	res.render("login", {page: 'login'});
});

// Handling login logic
router.post("/login", passport.authenticate("local", {
		successRedirect: "/home",
		failureRedirect: "/login"
	}), (req, res) => {
});

// The landing page for a logged in user
router.get("/home", middleware.isLoggedIn, (req, res) => {
res.render("home", {page: 'home'});
});

// Logout logic
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/login");
});

// * Catch-all route matcher (Everything else)
router.get("*", (req, res) => {
	res.send("Howdy? What are you doing with your life?");
});

module.exports = router;