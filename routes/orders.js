const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");
const middleware = require("../middleware");
const sgMail = require('@sendgrid/mail');
const fs = require("fs");
const _ = require("lodash");
const wipState = require("../middleware/wip-states");
const statusBarState = require("../middleware/statusbar-states");

router.get("/orders", middleware.isLoggedIn, async (req, res, next) => {
	let { lastName, dob, address } = req.query;
	const perPage = 20;
	const pageQuery = parseInt(req.query.page);
	const pageNumber = pageQuery ? pageQuery : 1;
    if((lastName && dob) || (lastName && dob && address)) {
        dob = new RegExp(dobRegex(dob), 'gi');
		lastName = new RegExp(lastNameRegex(lastName), 'gi');
		address = new RegExp(addressRegex(address), 'gi');
        Order.find(
			{$and:[
				{LastName: lastName}, 
				{DOB: dob},
				{Street: address},
			]}).skip((perPage * pageNumber) - perPage).limit(perPage).sort({SalesOrderId : -1}).exec(function(err, allOrders) {
			Order.countDocuments().exec(function (err, count) {
				if(err){
            		console.log(err);
        		} else {
            	if (allOrders.length < 1) {
					req.flash("error", "No order matches that search. Please try again or hit the Reset Search button!");
					return res.redirect("back");
            	}
				res.render("orders/index", {orders: allOrders, current: pageNumber, pages: Math.ceil(count / perPage), noSearch: false});
           		}
			})
        })
    } else {
        // Get all orders from DB
        Order.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function(err, allOrders) {
			Order.countDocuments().exec(function (err, count) {
				if(err){
            		console.log(err);
           		} else {
            		res.render("orders/index",{orders: allOrders, current: pageNumber, pages: Math.ceil(count / perPage), noSearch: true});
           		} 
			})
		})
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
			res.render("orders/show", {
				order: foundOrder,  
				apptBooked: wipState.apptBooked, 
				awaitConfirmation: wipState.awaitConfirmation,
				billingReview: wipState.billingReview,
				delivered: wipState.delivered,
				idsOrdPending: wipState.idsOrdPending,
				idsOrdStaged: wipState.idsOrdStaged,
				inWarehouse: wipState.inWarehouse,
				misc: wipState.misc,
				notApplic: wipState.notApplic,
				withScheduling: wipState.withScheduling,
				pendingPatientContact: wipState.pendingPatientContact,
				priAuthPending: wipState.priAuthPending,
				ptReqDelay: wipState.ptReqDelay,
				qualPending: wipState.qualPending,
				pendingCopay: wipState.pendingCopay,
				remoteSetupPend: wipState.remoteSetupPend,
				setupComplete: wipState.setupComplete,
				stagedDelivery: wipState.stagedDelivery,
				stagedPickup: wipState.stagedPickup,
				priAuthStatus: statusBarState.priAuthStatus,
				priAuthPostStatus: statusBarState.priAuthPostStatus,
				remoteShip: statusBarState.remoteShip,
				deliveryStaged: statusBarState.deliveryStaged,
				statusSetupComplete: statusBarState.statusSetupComplete,
				resupplyQualPending: statusBarState.resupplyQualPending,
				resupplyPA: statusBarState.resupplyPA,
				resupplyPendingShip: statusBarState.resupplyPendingShip,
				resupplyComplete: statusBarState.resupplyComplete,
				idsOne: statusBarState.idsOne,
				idsTwo: statusBarState.idsTwo,
				idsThree: statusBarState.idsThree,
				idsFour: statusBarState.idsFour,
				idsFive: statusBarState.idsFive
			});
		}
	});
});

router.post("/orders/:id", async (req, res) => {
	try {
		// let msg = [];
		sgMail.setApiKey(process.env.SENDGRID_API_KEY_ORDER);
		// if (Order["Marketing Rep_Full Name"] === "Deakin, Ryan") {
		// 	msg = {
		// 	to: req.body.to,
		// 	from: 'info@hcmatco.com',
		// 	subject: req.body.subject,
		// 	html: '<p style="font-size:16px;line-height:10px">From: ' + req.body.from + '</p>' + '<p style="font-size:16px;line-height:10px">' + 'Message: ' + req.body.message + '</p>' + '<br>' + '<p style="font-size:16px;">' + 'Physician Portal - www.mycpaporder.com' + '</p>',
		// 	}
		// } else {
		// 	msg = {
		// 	to: 'info@hcmatco.com',
		// 	from: 'info@hcmatco.com',
		// 	subject: req.body.subject,
		// 	html: '<p style="font-size:16px;line-height:10px">From: ' + req.body.from + '</p>' + '<p style="font-size:16px;line-height:10px">' + 'Message: ' + req.body.message + '</p>' + '<br>' + '<p style="font-size:16px;">' + 'Physician Portal - www.mycpaporder.com' + '</p>',
		// 	}	
		// }
		const msg = {
			to: req.body.to,
			from: 'info@hcmatco.com',
			subject: req.body.subject,
			html: '<p style="font-size:16px;line-height:10px">From: ' + req.body.from + '</p>' + '<p style="font-size:16px;line-height:10px">' + 'Message: ' + req.body.message + '</p>' + '<br>' + '<p style="font-size:16px;">' + 'Physician Portal - www.mycpaporder.com' + '</p>',
		}
		sgMail
		.send(msg)
		.then(() => {
			req.flash("success", "Email sent!"); // We can change this to be whatever we want it to say
			console.log('Email Sent');
		})
		.then(() => {
			res.redirect("back");
		})
	}
	catch (error) {
		console.log(error);
		req.flash("error", "Please try again!");
		res.redirect('back');
}
});


function lastNameRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function addressRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

function dobRegex(text) {
	// return text.replace(/^([1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)([0-9]{2})/);
    // return text.replace(/^([1-9]|1[0-2])\/([1-9]|1\d|2\d|3[01])\/(19|20)([0-9]{2})/);
	return text.replace(/.+?(?=abc)/);
};


module.exports = router;