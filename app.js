const express   = require("express"), 
	 bodyParser = require("body-parser"), 
	 mongoose   = require("mongoose"),
	 flash		= require("connect-flash"),
	 passport 	= require("passport"),
	 LocalStrategy = require("passport-local"),
	 User		= require("./models/user");
;

// Require routes separately
const authRoutes = require("./routes/index");

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());

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

// Add some middleware to include a new user to each page
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", authRoutes);

// Tell Express to listen for requests (start server)
app.listen(3000, () => {
	console.log("Ride hailing app's server listening on port 3000");
});