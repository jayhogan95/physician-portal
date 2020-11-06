const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "Please login first!");
	res.redirect("/login");
};

middlewareObj.isAdmin = (req, res, next) => {
	if (req.user.isAdmin) {
		return next();
	}
	req.flash("error", "You do not have permission to do that!");
	res.redirect("/orders");
};

module.exports = middlewareObj;