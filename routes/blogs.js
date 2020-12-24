const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");
const Status = require("../models/status");
const middleware = require("../middleware");
const _ = require("lodash");

router.get("/blog/order-status-meaning", middleware.isLoggedIn, (req, res, next) => {
	const querySearch = req.query.search;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all users from DB
        Status.find({orderStatusName: regex}, (err, allStatus) => {
           if (err){
			   res.render("404");
               console.log(err);
           } else {
              if (allStatus.length < 1) {
                  req.flash("error", "No order status matches that search. Please try again!");
				  return res.redirect("back");
              }
              res.render("blog/order-status/index", {status: allStatus});
           }
        });
    } else {
        // Get all users from DB
        Status.find({}, (err, allStatus) => {
           if(err){
               console.log(err);
           } else {
              res.render("blog/order-status/index", {status: allStatus});
           }
        });
    }
});

router.post("/blog/order-status-meaning", middleware.isLoggedIn, (req, res) => {
	const orderStatusName = req.body.orderStatusName;
	const orderStatusMeaning = req.body.orderStatusMeaning;
	const newStatus = {orderStatusName: orderStatusName, orderStatusMeaning: orderStatusMeaning}
	
	Status.create(newStatus, (err, newlyCreated) => {
		if (err) {
			console.log(err)
		} else {
			console.log(newlyCreated);
            res.redirect("/blog/order-status-meaning");
		}
	})
})

// NEW Route
router.get("/blog/order-status-meaning/new", middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
	res.render("blog/order-status/new");
});

// EDIT Route
router.get("/blog/order-status-meaning/:id/edit", middleware.isAdmin, (req, res) => {
	Status.findById(req.params.id, (err, foundStatus) => {
		if (err) {
			res.redirect("/blog/order-status-meaning");
		} else {
			res.render("blog/order-status/edit", {status: foundStatus});
		}
	});
});

// UPDATE route
router.put("/blog/order-status-meaning/:id", middleware.isAdmin, (req, res) => {
	Status.findByIdAndUpdate(req.params.id, req.body.status, (err, updatedStatus) => {
		if (err) {
			req.flash("error", "Cannot update status. Please try again or contact support");
			res.redirect("/blog/order-status-meaning");
		} else {
			req.flash("success", "Status successfully updated!");
			res.redirect("/blog/order-status-meaning");
		}
	});
});

// DESTROY route
router.delete("/blog/order-status-meaning/:id", middleware.isAdmin, (req, res) => {
	Status.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect("/blog/order-status-meaning");
		} else {
			req.flash("success", "Order Status has been deleted!");
			res.redirect("/blog/order-status-meaning");
		}
	});
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;