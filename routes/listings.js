const express = require("express");

const router = express.Router();

const Listing = require("../models/listing");

const Review = require("../models/reviews");

const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn } = require("../middleware.js");

const Listingcontroller = require("../controllers/listing.js");


// ======================================================
// MULTER
// ======================================================

const multer = require("multer");

const { storage } = require("../cloudconfig.js");

const upload = multer({
    storage
});


// ======================================================
// INDEX + CREATE
// ======================================================

// GET /listings
router
    .route("/")
    .get(
        wrapAsync(Listingcontroller.index)
    )

    // POST /listings
    .post(
        isLoggedIn,
        upload.single("image"),
        wrapAsync(Listingcontroller.postListings)
    );


// ======================================================
// NEW LISTING FORM
// GET /listings/new
// ======================================================

router.get(
    "/new",
    isLoggedIn,
    Listingcontroller.renderNewForm
);


// ======================================================
// EDIT FORM
// GET /listings/:id/edit
// ======================================================

router.get(
    "/:id/edit",
    isLoggedIn,
    Listingcontroller.editListing
);


// ======================================================
// SHOW / UPDATE / DELETE
// ======================================================

router
    .route("/:id")

    // GET /listings/:id
    .get(
        Listingcontroller.showListing
    )

    // PUT /listings/:id
    .put(
        isLoggedIn,
        upload.single("listing[image]"),
        wrapAsync(Listingcontroller.updateListing)
    )

    // DELETE /listings/:id
    .delete(
        isLoggedIn,
        wrapAsync(Listingcontroller.deleteListing)
    );


module.exports = router;