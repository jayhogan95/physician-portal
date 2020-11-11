const 	express = require("express"),
		router = express.Router(),
		passport = require("passport"),
		User = require("../models/user"),
		middleware = require("../middleware"),
		async = require("async"),
		nodemailer = require("nodemailer"),
		smtpTransport = require("nodemailer-smtp-transport"),
		crypto = require("crypto"),
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
		role: req.body.role
	});
	
	let adminCode;
	if(adminCode === process.env.ADMINCODE) {
		newUser.isAdmin = true;
	}
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
			successFlash: "Welcome, " + req.body.username + "!"
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

router.post('/forgot', (req, res, next) => {
  async.waterfall([
    (done) => {
      crypto.randomBytes(20, (err, buf) => {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    (token, done) => {
      User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save((err) => {
          done(err, token, user);
        });
      });
    },
    (token, user, done) => {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.GMAILUSER,
        subject: 'HCM Physician Portal Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], (err) => {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', (req, res) => {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', (req, res) => {
  async.waterfall([
    (done) => {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, (err) => {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save((err) => {
              req.logIn(user, (err) => {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    (user, done) => {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.GMAILUSER,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], (err) => {
    res.redirect('/');
  });
});


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

// 404 page
router.get("/404", (req, res) => {
	res.render("404");
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;