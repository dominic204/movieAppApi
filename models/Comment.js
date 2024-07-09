const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "Description is required"],
  },
  comment: {
    type: String,
    required: [true, "Genre is required"],
  }

module.exports = mongoose.model("Movie", movieSchema);

