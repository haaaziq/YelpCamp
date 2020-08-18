const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      User          = require("./models/user"),
      passport      = require("passport"),
      localStrategy = require("passport-local"),
      seedDB        = require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology:true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

seedDB();

// Passport Config
app.use(require("express-session")({
    secret: "Kaamehaamehaaa",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// to use currentUser in ALL routes... using app.use (middleware)
app.use(function(req, res, next){
    // whatever we put in res.locals is available in all templates...here currentUser
    res.locals.currentUser = req.user;
    next(); //next, since it is a middleware
});

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
app.get("/campgrounds/:id/comments/new", isSignedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log("ERROR in finding campground in comments NEW route");
        }else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// CREATE
app.post("/campgrounds/:id/comments", isSignedIn, function(req, res){
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

//_______________________________________________
//____________A U T H . R O U T E S______________

// show sign up form
app.get("/register", function(req, res){
    res.render("register");
});

// handling register logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// show login form
app.get("/login", function(req, res){
    res.render("login");
});

// handling login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){
});

// Logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

// middleware function to check if signed in or not
function isSignedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// Listening
app.listen(80, function(){
    console.log("The YelpCamp SERVER has started!");
});