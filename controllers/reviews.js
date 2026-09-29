const Listing=require("../models/listing");
const Review =require("../models/reviews");


// CREATE REVIEW
module.exports.createReview=async (req, res, next) => {
    try {

        // Step 1: Find listing
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            throw new Error("Listing not found");
        }

        // Step 2: Create review
        const review = new Review(req.body);

        // Step 3: Connect review with listing
        review.listing = listing._id;

        // Step 4: Save review
        await review.save();

        console.log("✅ Review created:", review._id);

        // Step 5: Flash message
        req.flash(
            "success",
            "Review added successfully!"
        );

        // Step 6: Save session before redirect
        req.session.save((err) => {
            if (err) {
                return next(err);
            }

            res.redirect(`/listings/${listing._id}`);
        });

    } catch (err) {

        console.log("❌ REVIEW ERROR:", err);

        req.flash(
            "error",
            "Failed to add review."
        );

        res.redirect(`/listings/${req.params.id}`);
    }
}





module.exports.deleteReview=async (req, res, next) => {

    try {

        // Step 1: Get IDs from URL
        const { id, reviewId } = req.params;

        console.log("🗑️ DELETE REVIEW ROUTE");
        console.log("🏠 LISTING ID:", id);
        console.log("⭐ REVIEW ID:", reviewId);

        // Step 2: Find and delete review
        const deletedReview = await Review.findByIdAndDelete(
            reviewId
        );

        // Step 3: Check if review exists
        if (!deletedReview) {
            throw new Error("Review not found");
        }

        console.log(
            "✅ REVIEW DELETED:",
            deletedReview._id
        );

        // Step 4: Success message
        req.flash(
            "success",
            "Review deleted successfully!"
        );

        // Step 5: Go back to listing
        res.redirect(`/listings/${id}`);

    } catch (err) {

        console.log(
            "❌ DELETE REVIEW ERROR:",
            err
        );

        req.flash(
            "error",
            "Failed to delete review."
        );

        res.redirect(`/listings/${req.params.id}`);
    }
}



