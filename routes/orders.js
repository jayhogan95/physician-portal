const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");
const middleware = require("../middleware");

router.get("/orders", middleware.isLoggedIn, (req, res) => {
	/* let { lastName, dob, address } = req.query;
    if(lastName && dob) {
        dob = new RegExp(escapeRegex(dob), 'gi');
		lastName = new RegExp(textRegex(lastName), 'gi');
        Order.find(
			{$and:[
				{lastName: lastName}, 
				{dateOfBirth: dob}
			]}, function(err, allOrders){
           if(err){
               console.log(err);
           } else {
            	if (allOrders.length < 1) {
					req.flash("error", "No order matches that search. Please try again!");
					return res.redirect("back");
              }
			   console.log(dob);
				res.render("orders/index", {orders: allOrders, noSearch: false});
           }
        }).sort({dateCreated : 1});
    } else {
        // Get all orders from DB
        Order.find({}, function(err, allOrders){
           if(err){
               console.log(err);
           } else {
              res.render("orders/index",{orders: allOrders, noSearch: true});
           }
        });
    } */
	let { lastName, dob, address } = req.query;
    if((lastName && dob) || (lastName && dob && address)) {
        dob = new RegExp(escapeRegex(dob), 'gi');
		lastName = new RegExp(textRegex(lastName), 'gi');
		address = new RegExp(addressRegex(address), 'gi');
        Order.find(
			{$and:[
				{lastName: lastName}, 
				{dateOfBirth: dob},
				{address: address}
			]}, function(err, allOrders){
           if(err){
               console.log(err);
           } else {
            	if (allOrders.length < 1) {
					req.flash("error", "No order matches that search. Please try again!");
					return res.redirect("back");
              }
				res.render("orders/index", {orders: allOrders, noSearch: false});
           }
        }).sort({dateCreated : 1});
    } else {
        // Get all orders from DB
        Order.find({}, function(err, allOrders){
           if(err){
               console.log(err);
           } else {
              res.render("orders/index",{orders: allOrders, noSearch: true});
           }
        });
    } 
	// needed to hold values of search
	res.locals.query = req.query;
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

function textRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function addressRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function escapeRegex(text) {
	return text.replace(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/);
    // return text.replace(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/, "\\$&");
}; 

module.exports = router;