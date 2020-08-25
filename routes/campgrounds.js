// For Campground Routes
const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");
const middleware = require("../middleware");

//INDEX --> show all resources
router.get("/", function(req, res){
    //Reading from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log("Something went Wrong");
        } else{
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

//NEW --> Form to create new Campground
router.get("/new", middleware.isSignedIn, function(req, res){
    res.render("campgrounds/new");
});


//CREATE --> Create new Campground in DB
router.post("/", middleware.isSignedIn, function(req, res){
    //name, img and desc from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    
    var newCampground = {
        name: name,
        image: image,
        description: desc,
        author: author
    };
    
    //Creating in DB
    Campground.create(newCampground, function(err, campground){
        if(err){
            console.log("ERROR! in creating new Campground");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

//SHOW --> Show details for one resource(here: campground)
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("Error in finding by ID");
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            res.redirect("/campgrounds/"+req.params.id);
        } else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//UPDATE Campground Route
router.put("/:id", middleware.checkCampgroundOwner, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/"+updatedCampground._id);
        }
    });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err, deletedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;