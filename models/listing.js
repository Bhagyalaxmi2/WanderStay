const mongoose = require("mongoose");

const Review = require("./reviews.js");

const { Schema } = mongoose;


// ========================================
// LISTING SCHEMA
// ========================================

const listingSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    image: {
        url: String,
        filename: String
    },

    description: {
        type: String
    },

    price: {
        type: Number,
        required: true,
        default: 0
    },

    location: {
        type: String
    },

    country: {
        type: String
    },


    category: {
    type: String,
    enum: [
        "Farms",
        "Rooms",
        "Amazing Views",
        "Iconic Cities",
        "Surfing",
        "Amazing Pools",
        "Beach",
        "Cabins",
        "Lakefront"
    ]
},
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});


// ========================================
// DELETE REVIEWS WITH LISTING
// ========================================

listingSchema.post("findOneAndDelete", async (listing) => {

    if (listing) {

        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });

    }

});




// ========================================
// EXPORT
// ========================================

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;