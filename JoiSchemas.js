const Joi = require('joi');

module.exports.campgroundJoi = Joi.object({
  // This is not a mongoose schema, has nothing to do with a db
  // This is a Joi schema, uses the same term but nothing to do w/ a db
  // Used to validate data clientside
  campground: Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
  }).required(),
});

module.exports.reviewJoi = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
