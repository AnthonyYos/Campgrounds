const Campground = require("../models/campground");
const Review = require("../models/review");


const isLoggedIn = (req, res, next) => {
    /** Passport's implementation of req.isAuthenticated()
        req.isAuthenticated = function() {
            var property = 'user';
            if (this._passport && this._passport.instance._userProperty) {
            property = this._passport.instance._userProperty;
        }
     */
    // isAuthenticated() helper method given by passport, added to the request object
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "Login required to access that functionality.");
        return res.redirect('/login');
    }
    next();
}

const isAuthor = async (req, res, next) => {
    // This is campground id, req & res were given the req/res from where the middleware was called from
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // Check if campground author id is the same as the logged in user
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have the correct permissions.");
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}

const isReviewAuthor = async (req, res, next) => {
    // This is review id, req & res were given the req/res from where the middleware was called from
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    // Check if review author id is the same as the logged in user
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have the correct permissions.");
        return res.redirect(`/campgrounds/${id}`);
    }
    next()
}

module.exports = {
    isLoggedIn,
    isAuthor,
    isReviewAuthor
}
/**
 * dshj
 * dsjkd
 * dj
 */