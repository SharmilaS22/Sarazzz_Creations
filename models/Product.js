const mongoose = require("mongoose");
const { Review, reviewSchema } = require("./Review");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    videos: [String],
    abouts: {
        type: [String],
        required: true
    },
    reviews: [reviewSchema]
});

module.exports = Product = mongoose.model("Product", productSchema);