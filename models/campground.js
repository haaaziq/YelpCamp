const mongoose = require("mongoose");

//Campground Schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    //Adding Association with User
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    //Adding Association with Comment Schema
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

//Compiling Schema into Model and returning using module.exports
module.exports = mongoose.model("Campground", campgroundSchema);