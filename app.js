const 	express = require("express"),
		app = express(),
		path = require("path"),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
		passport = require("passport"),
		LocalStrategy = require("passport-local"),
		methodOverride = require("method-override"),
		session = require("express-session"),
		flash = require("connect-flash"),
		moment = require("moment"),
		csv = require("fast-csv"),
		cron = require("node-cron"),
		fs = require("fs"),
		_ = require("lodash"),
		soap = require("soap"),
		sgMail = require("@sendgrid/mail"),
		User = require("./models/user"),
		Order = require("./models/order"),
		OrderStatus = require("./models/status");

const port = process.env.PORT || 3000;
// configure dotenv
require('dotenv').config();

// Requiring routes
const indexRoutes = require("./routes/index"),
	  orderRoutes = require("./routes/orders"),
	  blogRoutes = require("./routes/blogs");

let dbURL = process.env.NODE_ENV === "production" ? process.env.HEROKU_DBURL : process.env.DATABASEURL;
mongoose.connect(dbURL, {
	useNewUrlParser: true,
  	useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(flash());

// Passport Configuration
app.use(require("express-session")({
	secret: "Our doctor portal",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Due to refactoring of code - need the app to know to use these routes
app.use(indexRoutes);
app.use(orderRoutes);
app.use(blogRoutes);

app.listen(port, () => { 
  console.log("Physicians Portal Server has Started!"); 
});

