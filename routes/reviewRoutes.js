const express = require("express");
// Routers get separate req.params, you need to set {mergeParams: true}
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isReviewAuthor } = require("../utils/userPermissions");
const { validateReview } = require("../utils/formValidation");
const reviewController = require("../controllers/review");


// Post reviews
router.post("/", isLoggedIn, validateReview, catchAsync(reviewController.postReview))

//Delete reviews
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview))

module.exports = router;