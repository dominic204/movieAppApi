const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
   director: {
    type: String,
    required: [true, "Director is required"],
  },
  year: {
    type: String,
    required: [true, "Year is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
  },

  comments: [
    {
      userId: {
        type: String
      },
      comment: {
        type: String
      }
    },
  ],
});

module.exports = mongoose.model("Movie", movieSchema);

