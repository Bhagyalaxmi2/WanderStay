// ======================================================
// 1. IMPORTS
// ======================================================

require("dotenv").config();
 
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/User.js");


// ======================================================
// 2. ROUTES
// ======================================================

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/User.js");


// ======================================================
// 3. CUSTOM ERROR
// ======================================================

const ExpressError = require("./utils/ExpressError.js");


// ======================================================
// 4. APP
// ======================================================

const app = express();

const PORT = process.env.PORT || 8080;


// ======================================================
// 5. MONGODB CONNECTION
// ======================================================
const mongo_url =
    process.env.ATLAS_URI ||
    "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(mongo_url);
}


main()
    .then(() => {

        console.log("✅ Connected to MongoDB");

    })
    .catch((err) => {

        console.log(
            "❌ MongoDB Connection Error:",
            err
        );

    });


// ======================================================
// 6. VIEW ENGINE
// ======================================================

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");

app.set(
    "views",
    path.join(__dirname, "views")
);


// ======================================================
// 7. BASIC MIDDLEWARE
// ======================================================

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

app.use(methodOverride("_method"));


// ======================================================
// 8. STATIC FILES
// ======================================================

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ======================================================
// 9. SESSION
// ======================================================

const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_URI,
    dbName: "wanderlust",
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET || "mysupersecretecode",
    resave: false,
    saveUninitialized: false,

    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 15,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    }
};

app.use(session(sessionOptions));


app.use((req, res, next) => {
    res.locals.currUser = req.user;
    next();
});

// ======================================================
// 10. FLASH
// ======================================================

// Flash MUST come after session

app.use(flash());


// ======================================================
// 11. PASSPORT CONFIGURATION
// ======================================================

// Passport authentication strategy

passport.use(
    new LocalStrategy(
        User.authenticate()
    )
);


// ======================================================
// SERIALIZE USER
// ======================================================

passport.serializeUser(
    User.serializeUser()
);


// ======================================================
// DESERIALIZE USER
// ======================================================

passport.deserializeUser(
    User.deserializeUser()
);


// ======================================================
// 12. PASSPORT MIDDLEWARE
// ======================================================

// Initialize Passport

app.use(
    passport.initialize()
);


// Enable persistent login sessions

app.use(
    passport.session()
);


// ======================================================
// 13. CURRENT USER → EJS
// ======================================================

// This makes req.user available as currUser
// inside ALL EJS files.

app.use((req, res, next) => {

    console.log(
        "👤 CURRENT USER:",
        req.user
    );

    res.locals.currUser = req.user || null;

    next();

});


// ======================================================
// 14. FLASH → EJS
// ======================================================

app.use((req, res, next) => {

    console.log(
        "\n➡️ REQUEST:",
        req.method,
        req.originalUrl
    );

    console.log(
        "SESSION ID:",
        req.sessionID
    );

    console.log(
        "FLASH BEFORE READ:",
        req.session.flash
    );


    // Make flash messages available
    // inside every EJS file

    res.locals.success =
        req.flash("success");

    res.locals.error =
        req.flash("error");


    console.log(
        "SUCCESS READ:",
        res.locals.success
    );

    console.log(
        "ERROR READ:",
        res.locals.error
    );


    next();

});


// ======================================================
// 15. FORGOT PASSWORD PAGE
// ======================================================

// GET /forgot-password

app.get(
    "/forgot-password",
    (req, res) => {

        console.log(
            "🔥 FORGOT PASSWORD ROUTE HIT"
        );

        res.render(
            "Users/forgot-password"
        );

    }
);


// ======================================================
// 16. ROOT ROUTE
// ======================================================

// app.get("/", (req, res) => {

//     res.redirect("/listings");

// });


// ======================================================
// 17. LISTING ROUTES
// ======================================================

app.use(
    "/listings",
    listingRouter
);


// ======================================================
// 18. REVIEW ROUTES
// ======================================================

app.use(
    "/listings",
    reviewRouter
);


// ======================================================
// 19. USER / AUTH ROUTES
// ======================================================

app.use(
    "/",
    userRouter
);


// ======================================================
// 20. FAVICON
// ======================================================

app.get(
    "/favicon.ico",
    (req, res) => {

        res.status(204).end();

    }
);


// ======================================================
// 21. DEMO USER
// ======================================================

app.get(
    "/demouser",
    async (req, res, next) => {

        try {

            const fakeUser = new User({

                email: "student@gmail.com",

                username: "delts-student"

            });


            const registerUser =
                await User.register(
                    fakeUser,
                    "helloworld"
                );


            res.send(registerUser);

        } catch (err) {

            next(err);

        }

    }
);


// ======================================================
// 22. 404 HANDLER
// ======================================================

app.use(
    (req, res, next) => {

        console.log(
            "❌ 404 URL:",
            req.method,
            req.originalUrl
        );


        next(
            new ExpressError(
                404,
                "Page Not Found"
            )
        );

    }
);


// ======================================================
// 23. ERROR HANDLER
// ======================================================

app.use(
    (err, req, res, next) => {

        const status =
            err.statuscode ||
            err.status ||
            500;


        console.log(
            "❌ ERROR:",
            err
        );


        res
            .status(status)
            .render(
                "error",
                {
                    err
                }
            );

    }
);


// ======================================================
// 24. START SERVER
// ======================================================

app.listen(
    PORT,
    () => {

        console.log(
            `✅ Server running on http://localhost:${PORT}`
        );

    }
);