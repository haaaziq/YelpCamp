// For Comment Routes
const express = require("express");
const router = express.Router({mergeParams: true}); // add {mergeParams: true} to get campground from :id parameter, used in app.js 

const Comment = require("../models/comment");
const Campground = require("../models/campground");

// NEW
router.get("/new", isSignedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log("ERROR in finding campground in comments NEW route");
        }else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// CREATE
router.post("/", isSignedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log("ERROR in finding campground in comments CREATE route");
        }else {
            //If campground found then create comment and push it into founded campground comments array
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log("ERROR in creating comment");
                } else{
                    // Adding username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();

                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

// middleware function to check if signed in or not
function isSignedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;