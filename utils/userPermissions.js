const Campground = require("../models/campground");
const Review = require("../models/review");


const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "Login required to access that functionality.");
        return res.redirect('/login');
    }
    next();
}

const isAuthorOrAdmin = async (req, res, next) => {
    // This is campground id, req & res were given the req/res from where the middleware was called from
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // Check if campground author id is the same as the logged in user
    if (!(campground.author.equals(req.user._id) || req.user.roles.includes("admin"))) {
        req.flash("error", "You do not have the correct permissions.");
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}

const isReviewAuthorOrAdmin = async (req, res, next) => {
    // This is review id, req & res were given the req/res from where the middleware was called from
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    // Check if review author id is the same as the logged in user
    if (!(review.author.equals(req.user._id) || req.user.roles.includes("admin"))) {
        req.flash("error", "You do not have the correct permissions.");
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}

module.exports = {
    isLoggedIn,
    isAuthorOrAdmin,
    isReviewAuthorOrAdmin,
}