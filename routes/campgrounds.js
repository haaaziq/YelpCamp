// For Campground Routes
const express = require("express");
const router = express.Router();

const Campground = require("../models/campground");

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
router.get("/new", function(req, res){
    res.render("campgrounds/new");
});


//CREATE --> Create new Campground in DB
router.post("/", function(req, res){
    //name, img and desc from form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    
    var newCampground = {
        name: name,
        image: image,
        description: desc
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

// middleware function to check if signed in or not
function isSignedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;