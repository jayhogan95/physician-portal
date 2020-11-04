const mongoose = require("mongoose");
// Schema Setup
const orderSchema = new mongoose.Schema({
	id: String,
	firstName: String,
	lastName: String,
	dateOfBirth: String,
	wipState: String,
	dateCreated: String,
	city: String
});

module.exports = mongoose.model("Order", orderSchema);