const cloudinary = require("cloudinary").v2;

const { CloudinaryStorage } = require("multer-storage-cloudinary");


// ======================================================
// CLOUDINARY CONFIG
// ======================================================

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


// ======================================================
// STORAGE
// ======================================================

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

    params: {
        folder: "wanderstay",

        allowed_formats: ["jpg", "jpeg", "png"]
    }
});


// ======================================================
// EXPORT
// ======================================================

module.exports = {
    cloudinary,
    storage
};