const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const url = "/images/health_complex_icon_small.jpg"

const UserSchema = new mongoose.Schema({
	username: {type: String, unique: true, required: true},
	password: String,
	avatar: {type: String, default: url},
	firstName: {type: String, required: true},
	lastName: String,
	email: {type: String, unique: true, required: true},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	isAdmin: {type: Boolean, default: true},
	role: {type: String, enum: ["Employee", "Physician"]},
	branchAssoc: [String]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);