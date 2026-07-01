const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    },

    userName: {
        type: String
    },

    rating: {
        type: Number
    },

    reviewText: {
        type: String
    }

});

module.exports = mongoose.model("Review", reviewSchema);