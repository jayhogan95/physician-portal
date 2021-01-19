const 	express = require("express"),
		router = express.Router(),
		passport = require("passport"),
		User = require("../models/user"),
		middleware = require("../middleware"),
		nodemailer = require("nodemailer"),
		smtpTransport = require("nodemailer-smtp-transport"),
		crypto = require("crypto"),
		sgMail = require('@sendgrid/mail'),
		dotenv = require("dotenv");

router.get("/", middleware.isLoggedIn, (req, res) => {
	res.render("landing");
});

// AUTH routes
router.get("/register", middleware.isLoggedIn, middleware.isAdmin, (req, res) => {
	res.render("register");
});

router.post("/register", middleware.isAdmin, (req, res) => {
	const newUser = new User({
		username: req.body.username, 
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		role: req.body.role,
		branchAssoc: req.body.branchAssoc,
		isAdmin: req.body.isAdmin
	});
	
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			// req.flash("error", err.message);
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, () => {
			req.logout();
			req.flash("success", user.username + " has been registered!");
			res.redirect("/login");
		});
	});
});


// LOGIN route 
router.get("/login", (req, res) => {
	res.render("login");
});

router.post("/login", (req, res, next) => {
	passport.authenticate("local", 
		{
			successRedirect: "/",
			failureRedirect: "/login",
			failureFlash: true,
			// successFlash: "Welcome, " + req.body.username + "!"
		})(req, res);
});

//LOGOUT route
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You have successfully logged out!");
	res.redirect("/login");
});

// FORGOT password
router.get('/forgot', (req, res) => {
  res.render('forgot');
});

const generateResetToken = () => {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(20, (err, buf) => {
			if (err) {
				reject(err)
			} else {
				let reset_token = buf.toString('hex');
				resolve(reset_token)
			}
		})
	})
};

router.post('/forgot', async (req, res) => {
	try {
		let reset_token = await generateResetToken();
		
		let user = await User.findOne({email: req.body.email});
		if (!user) {
			req.flash('error', 'No account with that email address exists.');
			return res.redirect('/forgot');
		}
		user.resetPasswordToken = reset_token;
		user.resetPasswordExpires = Date.now() + 3600000;
		await user.save();
		
		sgMail.setApiKey(process.env.SENDGRID_API_KEY_RESET);
		const msg = {
			to: user.email,
			from: 'info@hcmatco.com',
			subject: 'HCM Physician Portal Password Reset',
			html: '<p style="font-size:16px;line-height:20px">Hi ' + user.username + ',</p>' + '<p style="font-size:16px;">Forgot your password? No problem!</p>' + '<p style="font-size:16px;">Please click the following link, or paste it into your browser to change your password:</p>' + '<p style="font-size:16px;line-height:20px">' +
				'http://' + req.headers.host + '/reset/' + reset_token + '</p>' + '<p style="font-size:16px;line-height:20px">If you did not request this, please ignore this email and your password will remain unchanged.</p>' + '<p style="font-size:16px;line-height:20px">If you have any trouble, please respond back to this email and we will get back to you as soon as possible!</p>' + '<p style="font-size:16px;line-height:20px">Thank you,</p>' + '<p style="font-size:16px;">Physician Portal</p>',
		}
		sgMail
		.send(msg)
		.then(() => {
			res.redirect("/reset-confirmation");
			// req.flash('success', 'Email has been sent'); not rendering
			console.log('Email Sent')
		})
	}
	catch (error) {
		console.log(error);
		res.redirect('/forgot')
	}
});

router.get('/reset/:token', async (req, res) => {
  let user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', async (req, res) => {
	try {
		let user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
			if (!user) {
          		req.flash('error', 'Password reset token is invalid or has expired.');
          		return res.redirect('back');
        	} 
			if (req.body.password === req.body.confirm) {
				user.setPassword(req.body.password, (err) => {
					user.resetPasswordToken = undefined;
					user.resetPasswordExpires = undefined;
					
					user.save((err) => {
						console.log(err);
					})
				})
			} else {
				req.flash("error", "Passwords do not match.");
				return res.redirect("back");
			}
		})
		sgMail.setApiKey(process.env.SENDGRID_API_KEY_RESET);
		const msg = {
			to: user.email,
			from: 'info@hcmatco.com',
			subject: 'Your password has been changed',
			html: 'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
		}
		sgMail
		.send(msg)
		.then(() => {
			console.log('Email Sent')
			req.flash("success", + "Email has been sent!"); // This isn't rendering
			res.redirect("/login");
		})
	}
	catch (error) {
		console.log(error);
	};
});

// Temp Password
// router.get("/change-password", async (req, res) => {
// 	try {
// 		let reset_token = await generateResetToken();
		
// 		let user = await User.findOne({email: req.body.email});
// 		if (!user) {
// 			req.flash('error', 'No account with that email address exists.');
// 			return res.redirect('/forgot');
// 		}
// 		user.resetPasswordToken = reset_token;
// 		user.resetPasswordExpires = Date.now() + 3600000;
// 		await user.save();
// 	} catch (error) {
// 		console.log(error);
// 	}
// })

// USER PROFILE route
router.get("/users/:id", (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if (err) {
			req.flash("error", "Something went wrong");
			res.redirect("/");
		} else {
			res.render("users/show", {user: foundUser});
		}
	})
});

// USER PROFILE EDIT route
router.get("/users/:id/edit", (req, res) => {
	User.findById(req.params.id, (err, foundUser) => {
		if (err) {
			res.redirect("/users/:id");
		} else {
			res.render("users/edit", {user: foundUser});
		}
	});
});

// USER PROFILE UPDATE route
router.put("/users/:id", (req, res) => {
	User.findByIdAndUpdate(req.params.id, req.body.user, (err, updatedProduct) => {
		if (err) {
			res.redirect("/users");
		} else {
			res.redirect("/users/" + req.params.id);
		}
	});
});

// ADMIN route 
router.get("/admin", middleware.isAdmin, (req, res) => {
	const querySearch = req.query.search;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all users from DB
        User.find({$or:[{username: regex}, {lastName: regex}, {role: regex}]}, (err, allUsers) => {
           if(err){
			   res.render("404");
               console.log(err);
           } else {
              if(allUsers.length < 1) {
                  req.flash("error", "No user matches that search. Please try again!");
				  return res.redirect("back");
              }
              res.render("admin", {users: allUsers});
           }
        });
    } else {
        // Get all users from DB
        User.find({}, (err, allUsers) => {
           if(err){
               console.log(err);
           } else {
              res.render("admin", {users: allUsers});
           }
        });
    }
});

// ADMIN DESTROY user route 
router.delete("/users/:id", middleware.isAdmin, (req, res) => {
	User.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect("/admin");
		} else {
			req.flash("success", "User has successfully been deleted!");
			res.redirect("/admin");
		}
	});
});

// Email Confirmation Page
router.get("/reset-confirmation", (req, res) => {
	res.render("reset-confirmation");
})

// 404 page
router.get("/404", (req, res) => {
	res.render("404");
});

router.get("*", (req, res) => {
	res.render("404");
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;