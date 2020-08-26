// For All Purpose Routes
const express = require("express");
const router = express.Router();

const User = require("../models/user");
const passport = require("passport");

// Root Route
router.get("/", function(req, res){
    res.render("landing");
});

//_________A U T H.  R O U T E S__________

// show sign up form
router.get("/register", function(req, res){
    res.render("register");
});

// handling register logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
});

// handling login logic
router.post("/login", passport.authenticate("local", {
    // successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
}) ,function(req, res){
    req.flash("success", "Hi " + req.user.username + "! welcome back..");
    return res.redirect("/campgrounds");
});

// Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged Out Successfully");
    res.redirect("/campgrounds");
});

module.exports = router;