const mongoose = require("mongoose");

// Comment Schema & Model
const commentSchema = new mongoose.Schema({
    author: String,
    text: String
});

module.exports = mongoose.model("Comment", commentSchema);