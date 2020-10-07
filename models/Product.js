const { Schema, model } = require("mongoose");
const { reviewSchema } = require("./Review");
const { imageSchema } = require("./Image");

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
  imgmodel: [imageSchema],
  videos: [String],
  youtubeID: String,
  abouts: {
    type: [String],
    required: true,
  },
  reviews: [reviewSchema],
});

module.exports = Product = model("Product", productSchema);
