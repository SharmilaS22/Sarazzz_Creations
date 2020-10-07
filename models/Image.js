const { Schema, model } = require("mongoose");

const imageSchema = Schema({
  name: String,
  desc: String,
  img: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = {
  Image: model("Image", imageSchema),
  imageSchema: imageSchema,
};
