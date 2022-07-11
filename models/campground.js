const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    name: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    geometry: {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  opts
);

CampgroundSchema.virtual('properties.popupMarker').get(function () {
  return `<a href="/campgrounds/${this._id}">${this.name}</a>`;
});

CampgroundSchema.post('findOneAndDelete', async (campground) => {
  if (campground.reviews.length) {
    //Delete all reviews by id, where id is in campground.reviews
    await Review.deleteMany({ _id: { $in: campground.reviews } });
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);
/*
    if (farm.products.length) {
        //Delete all products by id, where id is in farm.products
        await Product.deleteMany({ _id: { $in: farm.products } })
    }
 */
