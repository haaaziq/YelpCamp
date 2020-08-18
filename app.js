const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      seedDB        = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology:true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

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
            res.render("campgrounds/index", {campgrounds: campgrounds});
        }
    });
});

//NEW --> Form to create new Campground
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
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
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//_________________________________________
//____________COMMENTS ROUTES______________

// NEW
app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log("ERROR in finding campground in comments NEW route");
        }else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// CREATE
app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log("ERROR in finding campground in comments CREATE route");
        }else {
            //If campground found then create comment and push it into founded campground comments array
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log("ERROR in creating comment");
                } else{
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + foundCampground._id);
                }
            });
        }
    });
});

// Listening
app.listen(80, function(){
    console.log("The YelpCamp SERVER has started!");
});