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
		csv = require("fast-csv"),
		soap = require("soap"),
		User = require("./models/user"),
		Order = require("./models/order");

/* let Client = require("ssh2-sftp-client");
let sftp = new Client(); */
const port = process.env.PORT || 3000;
// configure dotenv
require('dotenv').config();

// Requiring routes
const indexRoutes = require("./routes/index"),
	  orderRoutes = require("./routes/orders");

mongoose.connect(process.env.DATABASEURL, {
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

// SFTP connection
/* const root = "/file";
sftp.connect({
	host: "sftp.brightree.net",
	port: 22,
	username: "EXT_CapeMedical",
	password: "C@p3medU$3r!!1"
}).then(() => {
	return sftp.exists("/file/Doctor_11-11-20.zip")
}).then(data => {
    console.log(data);          // will be false or d, -, l (dir, file or link)
}).then(() => {
    sftp.end();
}).catch(err => {
    console.error(err.message);
}); */

app.listen(port, () => { 
  console.log("Physicians Portal Server has Started!"); 
});

