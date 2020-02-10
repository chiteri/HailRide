const express   = require("express"), 
	 bodyParser = require("body-parser"), 
	 mongoose   = require("mongoose"),
	 passport 	= require("passport"),
	 LocalStrategy = require("passport-local"),
	 User		= require("./models/user");
;

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

// Include a public directory for storing static assets
app.use(express.static(__dirname+"/public"));

mongoose.connect("mongodb://localhost:27017/hail_ride", {useNewUrlParser: true, useUnifiedTopology: true});

// PASSPORT CONFIGURATION
// Set up Express sessions
app.use(require("express-session")({
	secret: "How do you shoot the devil in the back? What if you miss?",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// The landing page
app.get("/", (req, res) => {
	res.render("login");
});

// =============
//  AUTH ROUTES
// =============
// The user registration page
app.get("/register", (req, res) => {
	res.render("register");
});

// Handle sign up logic
app.post("/register", (req, res) => {
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
app.get("/login", (req, res) => {
	res.render("login");
});

// Handling login logic
app.post("/login", passport.authenticate("local", {
		successRedirect: "/home",
		failureRedirect: "/login"
	}), (req, res) => {
});

// The landing page for a logged in user
app.get("/home", isLoggedIn, (req, res) => {
	res.render("home");
});

// Logout logic
app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/login");
});

// Middleware to confirm if a user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

// * Catch-all route matcher (Everything else)
app.get("*", (req, res) => {
	res.send("Howdy? What are you doing with your life?");
});


// Tell Express to listen for requests (start server)
app.listen(3000, () => {
	console.log("Ride hailing app's server listening on port 3000");
});