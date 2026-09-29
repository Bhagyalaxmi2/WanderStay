const mongoose = require("mongoose");

const Listing = require("../models/listing.js");
const initData = require("./data.js");


// ========================================
// MONGODB CONNECTION
// ========================================

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderstay";

async function main() {

    await mongoose.connect(MONGO_URL);

    console.log("Connected to MongoDB");
}


// ========================================
// INITIALIZE DATABASE
// ========================================

const initDB = async () => {

    console.log("Starting database initialization...");


    // Step 1: Delete old listings
    await Listing.deleteMany({});

    console.log("Old listings deleted");


    // Step 2: Add owner to every listing
    initData.data = initData.data.map((obj) => {

        return {
            ...obj,

            // Put your User ObjectId here
            owner: "PUT_YOUR_USER_ID_HERE"
        };

    });


    // Step 3: Insert listings
    await Listing.insertMany(initData.data);

    console.log("Data was initialized");


    // Step 4: Check data
    const count = await Listing.countDocuments();

    console.log("Number of listings:", count);


    // Step 5: Close database
    mongoose.connection.close();

};


// ========================================
// RUN
// ========================================

main()
    .then(() => {
        initDB();
    })
    .catch((err) => {
        console.log("ERROR:", err);
    });