const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    text: String,
    createdAt: {type: Date},
    rating: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    campground: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campground"
    }
});

module.exports = mongoose.model("Comment", commentSchema);