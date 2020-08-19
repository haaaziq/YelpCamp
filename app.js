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

// Requiring Routes
const indexRoutes       = require("./routes/index"),
      commentRoutes     = require("./routes/comments"),
      campgroundRoutes  = require("./routes/campgrounds");

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

// Using Routes
app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes); // /campgrounds will be add as a prefix to all campground routes

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Listening
app.listen(80, function(){
    console.log("The YelpCamp SERVER has started!");
});