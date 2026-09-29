const express = require("express");

const router = express.Router();

const User = require("../models/User.js");

const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const userController= require("../controllers/user.js");




// Roter Routing  combine similar pathed routes together
router.route("/signup")
// Step 1: Signup page
.get( (req, res) => {
     res.render("Users/signup.ejs");})
.post( userController.signupUser);
  
// Step 3: Login page------------------------------------------------
router.route("/login")
.get(userController.loginpageUser)
// Step 4: Login user
.post(
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),   userController.loginUser);
    
// LOGOUT------------------------------------------------------


router.get("/logout",userController.logoutUser );


module.exports = router;