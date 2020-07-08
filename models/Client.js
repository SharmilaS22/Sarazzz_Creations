const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  recommendedBy: String,
  date: String
});

module.exports = Client = mongoose.model("Client", clientSchema);
