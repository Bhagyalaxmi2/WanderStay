const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

// ======================================================
// USER SCHEMA
// ======================================================

const userSchema = new mongoose.Schema({

    // User email
    email: {
        type: String,
        required: true,
        unique: true
    }

});

// ======================================================
// PASSPORT LOCAL MONGOOSE
// ======================================================

// This automatically adds:
// username
// hash
// salt
// authenticate()
// register()
// serializeUser()
// deserializeUser()

userSchema.plugin(passportLocalMongoose);

// ======================================================
// USER MODEL
// ======================================================

const User = mongoose.model("User", userSchema);

module.exports = User;