const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");
const middleware = require("../middleware");

router.get("/orders", middleware.isLoggedIn, (req, res) => {
	// var noMatch = null;
	let { lastName, dob } = req.query;
    if(lastName && dob) {
        dob = new RegExp(escapeRegex(dob), 'gi');
		lastName = new RegExp(escapeRegex(lastName), 'gi');
        // Get all orders from DB - this still needs work
        Order.find({$and:[{lastName: lastName}, {dateOfBirth: dob}]}, function(err, allOrders){
           if(err){
               console.log(err);
           } else {
            	if (allOrders.length < 1) {
					req.flash("error", "No order matches that search. Please try again!");
					return res.redirect("back");
              }
				res.render("orders/index", {orders: allOrders, noSearch: false});
           }
        });
    } else {
        // Get all products from DB
        Order.find({}, function(err, allOrders){
           if(err){
               console.log(err);
           } else {
              res.render("orders/index",{orders: allOrders, noSearch: true});
           }
        });
    }
});

// SHOW route
router.get("/orders/:id", middleware.isLoggedIn, (req, res) => {
	Order.findById(req.params.id, (err, foundOrder) => {
		if (err) {
			req.flash("error", "That order does not exist");
			res.redirect("/orders");
		} else {
			res.render("orders/show", {order: foundOrder});
		}
	});
});

/* function nameRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}; */

function escapeRegex(text) {
    return text.replace(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/, "\\$&");
}; 

module.exports = router;