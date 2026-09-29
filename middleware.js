// Step 1: Check whether user is logged in
const Listing= require("./models/listing");
const Review= require("./models/reviews");
const ExpressError= require("./models/reviews");
const {listingSchema, reviewSchema} =require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.saveRedirectUrl=req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");

        return res.redirect("/login");

    }

    next();

    
};

///author authenticatio
module.exports.isReviewAuthor =async (req, res, next) => {
let {id,reviewId} =req.params;
let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You not Author of this review!");
        return res.redirect("/listings/${id}");
    }

    next();

    
};



module.exports.saveRedirectUrl =(req,res,next)=> {
  if(req.session.saveRedirectUrl){
    res.locals.saveRedirectUrl=req.session.saveRedirectUrl;
  }
  next();
};