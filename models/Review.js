const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    name: String,
    review: String,
    time: String
});

module.exports = {
    Review: mongoose.model("Review", reviewSchema),
    reviewSchema: reviewSchema
};
