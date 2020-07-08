const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  time: String,
});

module.exports = {
  Review: mongoose.model("Review", reviewSchema),
  reviewSchema: reviewSchema,
};
