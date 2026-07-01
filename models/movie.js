const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    genre: {
        type: String,
        required: true
    },

    releaseYear: {
        type: Number,
        required: true
    },

    poster: {
        type: String
    },

    description: {
        type: String
    },

    trailer: {
        type: String
    }

});

module.exports = mongoose.model("Movie", movieSchema);