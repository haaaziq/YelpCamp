const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology:true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

seedDB();

//_________________________________R O U T E S______________________________________

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX --> show all resources
app.get("/campgrounds", function(req, res){
    //Reading from DB
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log("Something went Wrong");
        } else{
            res.render("index", {campgrounds: campgrounds});
        }
    });
});

//NEW --> Form to create new Campground
app.get("/campgrounds/new", function(req, res){
    res.render("new");
});


//CREATE --> Create new Campground in DB
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("Error in finding by ID");
        } else{
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(80, function(){
    console.log("The YelpCamp SERVER has started!");
});