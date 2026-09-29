const Listing = require("../models/listing");
const Review = require("../models/reviews");


// ======================================================
// INDEX
// GET /listings
// ======================================================

module.exports.index = async (req, res, next) => {

    try {

        const allListings = await Listing.find({});

        console.log("✅ Listings found:", allListings.length);

        res.render("listings/index", {
            allListings
        });

    } catch (err) {

        console.log("❌ INDEX ERROR:", err);

        next(err);
    }
};


// ======================================================
// NEW
// GET /listings/new
// ======================================================

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");

};


// ======================================================
// SHOW
// GET /listings/:id
// ======================================================

module.exports.showListing = async (req, res, next) => {

    try {

        const { id } = req.params;

        console.log("🔎 ID FROM URL:", id);

        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author"
                }
            })
            .populate("owner");


        if (!listing) {

            throw new Error("Listing not found");

        }


        const reviews = await Review.find({
            listing: listing._id
        }).populate("author");


        console.log("🏠 LISTING:", listing);

        console.log("👤 OWNER:", listing.owner);

        console.log("✅ Reviews found:", reviews.length);


        res.render("listings/show", {

            listing,

            id,

            reviews

        });

    } catch (err) {

        console.log("❌ SHOW ERROR:", err);

        next(err);
    }
};


// ======================================================
// CREATE
// POST /listings
// ======================================================

module.exports.postListings = async (req, res, next) => {

    try {

        console.log("🔥 CREATE ROUTE");

        console.log("📦 FORM DATA:", req.body);

        console.log("📸 FILE:", req.file);


        // Step 1: Create listing
        const listing = new Listing(req.body);


        // Step 2: Add owner
        listing.owner = req.user._id;


        // Step 3: Add image
        if (req.file) {

            listing.image = {

                url: req.file.path,

                filename: req.file.filename

            };

        }


        // Step 4: Save
        await listing.save();


        console.log(
            "✅ LISTING SAVED:",
            listing._id
        );


        console.log(
            "👤 OWNER:",
            listing.owner
        );


        // Step 5: Flash
        req.flash(
            "success",
            "New listing created successfully!"
        );


        // Step 6: Redirect
        res.redirect("/listings");


    } catch (err) {

        console.log(
            "❌ CREATE LISTING ERROR:",
            err
        );

        req.flash(
            "error",
            "Failed to create listing."
        );

        res.redirect("/listings/new");
    }
};


// ======================================================
// EDIT
// GET /listings/:id/edit
// ======================================================

module.exports.editListing = async (req, res, next) => {

    try {

        const listing = await Listing.findById(
            req.params.id
        );


        if (!listing) {

            throw new Error(
                "Listing not found"
            );

        }


        res.render("listings/edit", {
            listing
        });


    } catch (err) {

        console.log(
            "❌ EDIT ERROR:",
            err
        );

        next(err);
    }
};


// ======================================================
// UPDATE
// PUT /listings/:id
// ======================================================

module.exports.updateListing = async (req, res, next) => {

    try {

        const listing = await Listing.findById(
            req.params.id
        );


        if (!listing) {

            throw new Error(
                "Listing not found"
            );

        }


        // Update fields
        Object.assign(
            listing,
            req.body
        );


        // Update image
        if (req.file) {

            listing.image = {

                url: req.file.path,

                filename: req.file.filename

            };

        }


        await listing.save();


        console.log(
            "✅ LISTING UPDATED:",
            listing._id
        );


        req.flash(
            "success",
            "Listing updated successfully!"
        );


        res.redirect(
            `/listings/${listing._id}`
        );


    } catch (err) {

        console.log(
            "❌ UPDATE ERROR:",
            err
        );

        next(err);
    }
};


// ======================================================
// DELETE
// DELETE /listings/:id
// ======================================================

module.exports.deleteListing = async (
    req,
    res,
    next
) => {

    try {

        await Listing.findByIdAndDelete(
            req.params.id
        );


        req.flash(
            "success",
            "Listing deleted successfully!"
        );


        res.redirect("/listings");


    } catch (err) {

        console.log(
            "❌ DELETE ERROR:",
            err
        );

        req.flash(
            "error",
            "Failed to delete listing."
        );

        res.redirect("/listings");
    }
};