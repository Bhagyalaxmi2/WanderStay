const express = require("express");

const router = express.Router();
const wrapAsync=require("../utils/ExpressError");
const ExpressError=require("../utils/ExpressError")

const Review = require("../models/reviews");
const Listing = require("../models/listing");
const {
    validateReview,
    isLoggedIn,
    isReviewAuthor,
}=require("../middleware")

const ReviewController =require("../controllers/reviews");
// ======================================================
// CREATE REVIEW
// POST /listings/:id/reviews
// ======================================================

router.post("/:id/reviews",  isLoggedIn,ReviewController.createReview);

// DELETE REVIEW
// DELETE /listings/:id/reviews/:reviewId


router.delete("/:reviewId", isLoggedIn, ReviewController.deleteReview);

module.exports = router;