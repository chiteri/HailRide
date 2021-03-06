require("dotenv").config();

const express   = require("express"), 
	 bodyParser = require("body-parser"), 
	 mongoose   = require("mongoose"),
	 flash		= require("connect-flash"),
	 passport 	= require("passport"),
	 LocalStrategy = require("passport-local"),
	 User		= require("./models/user"),
	 https = require("https"),
	 fs = require("fs");
;

// Require routes separately
const rideRoutes = require("./routes/rides"), 
	  authRoutes = require("./routes/index");

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());

// Options for encryption 
const options = {
	key: fs.readFileSync(process.env.SSL_KEY_PATH), //ssl-cert-snakeoil.key"),
	cert: fs.readFileSync(process.env.SSL_CERT_PATH) // ssl-cert-snakeoil.crt") 
  };
  

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
app.use("/ride", rideRoutes);

// Tell Express to listen for requests (start server)
app.listen(3000, () => {
	console.log("Ride hailing app's server listening on port 3000");
});

// app.listen(8000);

https.createServer(options, app).listen(3030);
