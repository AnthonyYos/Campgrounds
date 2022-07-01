const Campground = require("../models/campground");
const Review = require("../models/review");

const postReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    // Explicitly set this because id data wont be filled out via form
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review posted.");
    res.redirect(`/campgrounds/${campground._id}`)
}

const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id), { $pull: { review: reviewId } };
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/campgrounds/${id}`)
}

module.exports = {
    postReview, deleteReview
}