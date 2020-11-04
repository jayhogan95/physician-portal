const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const User = require("../models/user");
const Order = require("../models/order");
const middleware = require("../middleware");
const soap = require('soap');

router.get("/orders", (req, res) => {
	// var noMatch = null;
	/* const noSearch = !req.query.search;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all orders from DB - this still needs work
        Order.find({$and:[{lastName: regex}, {dateOfBirth: regex}]}, function(err, allOrders){
           if(err){
               console.log(err);
           } else {
            	if (allOrders.length < 1) {
					req.flash("error", "No order matches that search. Please try again!");
					return res.redirect("back");
              }
			   console.log(req.query.search);
				res.render("orders/index", {orders: allOrders, noSearch: noSearch});
           }
        });
    } else {
        // Get all products from DB
        Order.find({}, function(err, allOrders){
           if(err){
               console.log(err);
           } else {
              res.render("orders/index",{orders: allOrders, noSearch: noSearch});
           }
        });
    } */
	const noSearch = !req.query.search;
	const querySearch = req.query.search;
    if(req.query.search) {
        // const regexName = new RegExp(nameRegex(req.query.search), 'gi');
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Order.find({dateOfBirth: regex}, (err, allOrders) => {
           if(err){
               console.log(err);
           } else {
              if(allOrders.length < 1) {
                  req.flash("error", "No order matches that search. Please try again!");
				  return res.redirect("back");
              }
			   console.log(req.query.search);
              res.render("orders/index", {orders: allOrders, noSearch: noSearch});
           }
        });
    } else {
        // Get all campgrounds from DB
        Order.find({}, (err, allOrders) => {
           if(err){
               console.log(err);
           } else {
              res.render("orders/index",{orders: allOrders, noSearch: noSearch});
           }
        });
    }
});

// SHOW route
router.get("/orders/:id", (req, res) => {
	Order.findById(req.params.id, (err, foundOrder) => {
		if (err) {
			req.flash("error", "That order does not exist");
			res.redirect("/orders");
		} else {
			res.render("orders/show", {order: foundOrder});
		}
	});
});

// Test BT API
/* const user = "jashogan@capemedical";
const password = "Viktoria1995";
var url = 'https://webservices.brightree.net/v0100-1501/OrderEntryService/SalesOrderService.svc ';
const auth = 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64')
      const options = {
        wsdl_headers: {
          'Authorization': auth
        }
	  }

soap.createClient(url, options, function(err, client) {
});

var url = 'https://webservices.brightree.net/v0100-1501/OrderEntryService/SalesOrderService.svc ';
router.get(url, function(req, res) {
	var responseJson = xml2Json(responseBody);
	console.log(responseJson)
	console.log(responseJson['wsdl:definitions']["wsdl:types"]["xs:schema"][0]["xs:element"][8]["xs:complexType"]["xs:sequence"]["xs:element"]["$"]["name"]);
}); */

/* function nameRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}; */

function escapeRegex(text) {
    return text.replace(/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/, "\\$&");
}; 

module.exports = router;