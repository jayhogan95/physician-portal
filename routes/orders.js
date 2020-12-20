const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");
const middleware = require("../middleware");
const sgMail = require('@sendgrid/mail');
const fs = require("fs");

router.get("/orders", middleware.isLoggedIn, (req, res, next) => {
	let { lastName, dob, address } = req.query;
    if((lastName && dob) || (lastName && dob && address)) {
        dob = new RegExp(dobRegex(dob), 'gi');
		lastName = new RegExp(lastNameRegex(lastName), 'gi');
		address = new RegExp(addressRegex(address), 'gi');
        Order.find(
			{$and:[
				{LastName: lastName}, 
				{DOB: dob},
				{Street: address},
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
        }).sort({CreateDT : 1});
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

router.post("/orders/:id", middleware.isLoggedIn, (req, res) => {
	try {
		sgMail.setApiKey(process.env.SENDGRID_API_KEY);
		const msg = {
			to: 'jasonhogan18@gmail.com',
			from: 'info@hcmatco.com',
			subject: req.body.subject,
			html: '<p style="font-size:16px;line-height:10px">From: ' + req.body.from + '</p>' + '<p style="font-size:16px;line-height:10px">' + req.body.message + '</p>',
		}
		sgMail
		.send(msg)
		.then(() => {
			req.flash("success", "Email sent!"); // We can change this to be whatever we want it to say
			console.log('Email Sent');
		})
		.then(() => {
			res.redirect("back");
		});
	}
	catch (error) {
		console.log(error);
		res.redirect('back')
	}
})


function lastNameRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function addressRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function dobRegex(text) {
	return text.replace(/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/);
    // return text.replace(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/, "\\$&");
}; 

module.exports = router;