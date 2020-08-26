// For Comment Routes
const express = require("express");
const router = express.Router({mergeParams: true}); // add {mergeParams: true} to get campground from :id parameter, used in app.js 

const Comment = require("../models/comment");
const Campground = require("../models/campground");
const middleware = require("../middleware");

// NEW
router.get("/new", middleware.isSignedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log("ERROR in finding campground in comments NEW route");
        }else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// CREATE
router.post("/", middleware.isSignedIn, function(req, res){
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
                    req.flash("success", "You added a comment");
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

// EDIT Comment Route
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("/campgrounds/" + req.params.id);
        } else{
            res.render("comments/edit", {comment: foundComment, campgroundID: req.params.id});
        }
    });
});

// UPDATE Comment Route
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "You edited your comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY Comment Route
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err, deletedComment){
        if(err){
            res.redirect("back");
        } else{
            req.flash("success", "Comment Deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;