const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology:true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//Campground Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

//Compiling Schema into Model
var Campground = mongoose.model("Campground", campgroundSchema);

// Creating First Campground in DB

// Campground.create({
//     name : "Salmon Creek", 
//     image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     description: "A beautiful camp side in US, a lot of trees and a beautiful weather and surroundings."
// }, function(err, campground){
//     if(err){
//         console.log("Error in Creating new Campground");
//     } else {
//         console.log("New Campground created in DB");
//         console.log(campground);
//     }
// });

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
    Campground.findById(req.params.id, function(err, foundCampground){
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