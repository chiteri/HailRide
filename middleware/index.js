// All middleware code goes here 
middlewareObj = {};

// Check if a user is logged in
middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "Please log in first!");
	res.redirect("/login");
}

module.exports = middlewareObj;