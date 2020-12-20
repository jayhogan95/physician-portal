const mongoose = require("mongoose");
// Schema Setup
const statusSchema = new mongoose.Schema({
	orderStatusName: {type: String, unique: true, required: true},
	orderStatusMeaning: {type: String, required: true}
});

module.exports = mongoose.model("Status", statusSchema);