const Campground = require("../models/campground"),
      Comment    = require("../models/comment");

var middlewareObj = {};

// middleware function to check if signed in or not
middlewareObj.isSignedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be Logged-in to do that");
    res.redirect("/login");
}

//middleware to check campground Ownership to provide EDIT and DELETE Authorisation
middlewareObj.checkCampgroundOwner =  function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Error in finding Campground");
                res.redirect("/campgrounds");
            } else{
                //if campground belong to current user
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You need to be Logged-in to do that");
        res.redirect("back");
    }
}

// middleware to check comment ownership || Authorisation
middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Error in finding Comment");
                res.redirect("back");
            } else{
                //if comment belong to current user
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "You need to be Logged-in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj;