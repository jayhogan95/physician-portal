const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");
const Status = require("../models/status");
const middleware = require("../middleware");

router.get("/blogs/order-status-meaning", middleware.isLoggedIn, (req, res, next) => {
	Status.find({}, (err, allStatus) => {
		if (err) {
			console.log(err);
		} else {
			res.render("blogs/order-status-meaning", {status: allStatus});
		}
	})
});

router.post("/blogs/order-status-meaning", middleware.isLoggedIn, (req, res) => {
	const name = req.body.name;
	const meaning = req.body.meaning;
	const newStatus = {name: name, meaning: meaning}
	
	Status.create(newStatus, (err, newlyCreated) => {
		if (err) {
			console.log(err)
		} else {
			console.log(newlyCreated);
            res.redirect("/blogs/order-status-meaning");
		}
	})
})

module.exports = router;