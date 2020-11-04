const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const defaultURL = "/images/health_complex_icon_small.jpg";

const UserSchema = new mongoose.Schema({
	username: {type: String, unique: true, required: true},
	password: String,
	avatar: {type: String, default: defaultURL},
	firstName: String,
	lastName: String,
	email: {type: String, unique: true, required: true},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
	isAdmin: {type: Boolean, default: false}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);