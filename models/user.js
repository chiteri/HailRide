const passportLocalMongoose = require("passport-local-mongoose"), 
	  mongoose 				= require("mongoose");

// Schema setup
const userSchema = new mongoose.Schema ({
	username: String,
	password: String,
	firstName: String,
	lastName: String, 
	email: String, 
	avatar: String,
	userType: String,
	isAdmin: {type: Boolean, default: false}
});

// Add some methods for authentication to the User model
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);