const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

// seed Data
var data = [
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blah blah balh blah blah"
    },
    {
        name: "Queen Hill",
        image: "https://images.unsplash.com/photo-1483381719261-6620dfa2d28a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blah blah balh blah blah"
    },
    {
        name: "Granite Hill",
        image: "https://images.unsplash.com/photo-1501703979959-797917eb21c8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "blah blah balh blah blah"
    }
];

function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log("ERROR in removing all campgrounds");
        }
        console.log("Campgrounds Removed");
        //Creating seed data
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log("ERROR in creating seed data");
                } else{
                    console.log("Campground created");
                    //creating comment
                    Comment.create({
                        author: "Homie",
                        text: "This is a beautiful place, wish there is Internet too"
                    }, function(err, comment){
                        if(err){
                            console.log("ERROR in creating comment");
                        }else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Comment Added");
                        }
                    });
                }
            });
        });
    });
}

module.exports = seedDB;