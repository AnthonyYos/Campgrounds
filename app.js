// If NODE_ENV is not in production, require dotenv and load .env file
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}
require("dotenv").config()
const express = require("express");
const app = express();

const path = require("path");
const engine = require('ejs-mate');

const session = require("express-session");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const MongoStore = require("connect-mongo");

const methodOverride = require("method-override");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// Routes
const campgroundRoutes = require("./routes/campgroundRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");

// mongo atlas
const db_url = process.env.db_url || 'mongodb://localhost:27017/campgrounds';
const secret = process.env.secret || "1234";


// DB connection
main()
    .then(() => console.log("Mongo connection open."))
    .catch(err => console.log("Mongo connection error.", err));
async function main() {
    await mongoose.connect(db_url);
}

// Use MongoStore to store our user sessios into MongoDB
const store = MongoStore.create({
    mongoUrl: db_url,
    crypto: {
        secret
    },
    touchAfter: 24 * 3600 // Lazy session update (time is in seconds), stops unnecessary resaves if there are no changes and a user refreshes page
})

const sessionConfig = {
    store,
    secret,
    resave: false, //tell the session store that a particular session is still active, which is necessary because some stores will delete idle (unused) sessions after some time.
    saveUninitialized: true, //  At the end of the request, the session object will be stored in the session store (which is generally some sort of database)
    cookie: {
        maxAge: Date.now(),
        httpOnly: true
    }
}
app.use(session(sessionConfig));

app.engine("ejs", engine);
// Setting an absolute path
// __dirname is the directory path name where this specific file is located
// joining __dirname path with /views, to create the absolute path to /views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

app.use(flash());
app.use(passport.initialize());
// Use if we want persistant login sessions (make sure it comes after session)
app.use(passport.session());
// User.autheticate comes from passport-local-mongoose (imported in the User.js model)
passport.use(new LocalStrategy(User.authenticate()));
// Use to tell how to store user in session
passport.serializeUser(User.serializeUser());
// Use to tell how to get user out of session
passport.deserializeUser(User.deserializeUser());

// Setup middleware to give access to flash message on all requests
app.use((req, res, next) => {
    // res.locals is an object that contains response local variables that were scoped to the request
    /**
     * assigning a local variable, currentUser, a reference to req.user
        * available to all request, because the middleware is setup to be used for all requests
    */
    res.locals.currentUser = req.user;
    // Assign types of flash messages to our locals w/ the key of success or error
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// Setting route prefixes and route source
app.use("/campgrounds", campgroundRoutes);
// By default reviewRoutes won't have access to :id, as this req.params is separate from req.params from reviewRoutes
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);



// Homepage
app.get("/", (req, res) => {
    res.render("home")
});

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went bad";
    res.status(statusCode).render("error", { err });
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});