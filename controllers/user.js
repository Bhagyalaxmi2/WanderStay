const Listing=require("../models/User.js");
const User=require("../models/User.js");


 module.exports.signupUser= async (req, res, next) => {
 
     try {
 
         // sign up page Step 1: Get data from signup form
         const { username, email, password } = req.body;
 
         console.log("📦 SIGNUP DATA:", {
             username,
             email
         });
 
         // Step 2: Create user object
         const newUser = new User({
             username,
             email
         });
 
         console.log("👤 USER BEFORE REGISTER:", newUser);
 
         // Step 3: Register user
         const registeredUser = await User.register(
             newUser,
             password
         );
 
         console.log(
             "✅ USER REGISTERED:",
             registeredUser.username
         );
 
         // Step 4: Automatically login
         req.login(registeredUser, (err) => {
 
             // Step 5: Passport login error
             if (err) {
                 console.log("❌ LOGIN AFTER SIGNUP ERROR:", err);
                 return next(err);
             }
 
             // Step 6: Success message
             req.flash(
                 "success",
                 "Welcome to Wanderstay!"
             );
 
             // Step 7: Redirect
             res.redirect("/listings");
         });
 
     } catch (err) {
 
         console.log("❌ SIGNUP ERROR:", err);
 
         req.flash(
             "error",
             err.message
         );
 
         res.redirect("/signup");
     }
 }
 ////

 ////////////login page------------
 
 module.exports.loginpageUser=  (req, res) => {

    res.render("Users/login.ejs");

}


///login user------------------------------
 
 module.exports.loginUser= (req, res) => {

        // Step 1: Login successful
        req.flash("success", "You have been logged in!");

        // Step 2: Get the URL user originally wanted
        const redirectUrl = req.session.redirectUrl || "/listings";

        // Step 3: Debug the redirect
        console.log("🔵 REDIRECT URL:", redirectUrl);

        // Step 4: Remove old redirect URL from session
        delete req.session.redirectUrl;

        // Step 5: Redirect user
        res.redirect(redirectUrl);
    }

    
///log0ut user------------------------------
 
 module.exports.logoutUser= (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash("success", "You have been logged out!");

        res.redirect("/listings");
    });

}