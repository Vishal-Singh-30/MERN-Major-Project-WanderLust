const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// creating review schema 
const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

// creating Review model ->
module.exports = mongoose.model("Review", reviewSchema);







