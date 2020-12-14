const mongoose = require("mongoose");
// Schema Setup
const orderSchema = new mongoose.Schema({
	SalesOrderId: String,
	"Work In Progress_WIP State": String,
	FirstName: String,
	LastName: String,
	dateOfBirth: String, //MISSING
	Patientid: String,
	branch: String, //MISSING
	Classification: String,
	CreateDT: String,
	"Date Qualified_15": String,
	ActualDeliveryDt: String,
	"Marketing Rep_Full Name": String,
	"Insurance_Pri Insurance Name": String,
	"Insurance_Sec Insurance Name": String,
	Street: String,
	Suite: String,
	City: String,
	st: String,
	Zip: String
});

module.exports = mongoose.model("Order", orderSchema);