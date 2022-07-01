const { campgroundJoi, reviewJoi } = require("../JoiSchemas");
const ExpressError = require("../utils/ExpressError");


const validateCampground = (req, res, next) => {
    const { error } = campgroundJoi.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewJoi.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports = {
    validateCampground,
    validateReview
}