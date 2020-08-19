const mongoose = require("mongoose");

// Comment Schema & Model
const commentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // associating user model with comment model by referencing ObjectId
        },
        username: String
    },
    text: String
});

module.exports = mongoose.model("Comment", commentSchema);