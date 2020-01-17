//======================= MODULES =======================
const express = require("express"),
      router = express.Router(),
      User = require("../models/user"),
      passport = require("passport"),
      middleware = require("../middleware");


// ------------------ Landing Page Routes ----------------------

router.route('/')
    .get((req, res) => {
        res.render("landing");
    });


// ------------------ Authentication Routes --------------------

router.route('/register')
    .get(middleware.isLoggedOut, function(req, res) {                              // Show register form
        res.render('register');
    })
    .post(middleware.isLoggedOut, function(req, res) {                              // Register new user
        let newUser = new User({username: req.body.username});
        User.register(newUser, req.body.password, function(error, user) {
            if (error) {
                req.flash('error', `Error: ${error.message}.`);
                return res.redirect('/register');
            }
            passport.authenticate('local')(req, res, function() {
                req.flash('success', `Welcome to YelpCamp, ${user.username}!`);
                res.redirect('/campgrounds');
            });
        });
    });

router.route('/login')

    .get(middleware.isLoggedOut, function(req, res) {              // Show login form
        res.render('login');
    })

    // .post([middleware.isLoggedOut, middleware.validateLogin,
    //     passport.authenticate("local", {                          // Log in user
    //     successRedirect: '/campgrounds',
    //     failureRedirect: 'back',
    //     failureFlash: 'Invalid username or password.'
    // })], function(req, res){});
    
    .post([middleware.isLoggedOut, function(req, res, next) {
      passport.authenticate('local', function(error, user, info) {
        let relPath = req.headers.referer.replace(req.headers.origin, "");
        if (error) {
            req.flash('error', error);
            res.redirect('back');
        }
        if (!user) {
            if (relPath === '/login') {
                req.flash('error', 'Error: Invalid credentials');
                return res.redirect('back');
            } else { return res.send({errorMsg: 'Invalid credentials'}) }
        }
        req.logIn(user, function(error) {
            if (error) {
                if (relPath === '/login') {
                    req.flash('error', 'Error: There was a problem logging in.');
                    return res.redirect('back');
                } else { return res.send({errorMsg: 'Error: There was a problem logging in'}) }                
            }
            if (relPath === '/login') {
                return res.redirect('/campgrounds');
            } else {
                return res.send({});
            }
        });
      })(req, res, next);
    }], function(req, res){});
    

router.route('/logout')                                          // Log user out
    .get(function(req, res) {
        req.logout();
        res.redirect('/campgrounds');
    });


module.exports = router;