const mongoose = require("mongoose");

const { Schema } = mongoose;

// ======================================================
// REVIEW SCHEMA
// ======================================================

const reviewSchema = new mongoose.Schema({

    // Rating from 1 to 5
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    // Review comment
    comment: {
        type: String,
        required: true
    },

    // Which listing this review belongs to
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing"
    }

}, {
    timestamps: true
}
);


// ======================================================
// MODEL
// ======================================================

const Review = mongoose.model(
    "Review",
    reviewSchema
);

module.exports = Review;