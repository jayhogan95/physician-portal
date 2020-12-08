const mongoose = require("mongoose");
// Schema Setup
const orderSchema = new mongoose.Schema({
	orderId: String,
	patientId: String,
	firstName: String,
	lastName: String,
	dateOfBirth: String,
	branch: String,
	classification: String,
	wipState: String,
	dateCreated: String,
	qualDate: String,
	actualDate: String,
	priInsurance: String,
	secInsurance: String,
	address: String,
	city: String,
	state: String,
	zipCode: String
});

module.exports = mongoose.model("Order", orderSchema);