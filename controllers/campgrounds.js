const mapbox_token = process.env.mapbox_token;
const Campground = require("../models/campground");

const mbxClient = require('@mapbox/mapbox-sdk');
const mbxGeoCode = require("@mapbox/mapbox-sdk/services/geocoding");

const baseClient = mbxClient({ accessToken: mapbox_token });
const geoCodeService = mbxGeoCode(baseClient);


// Campground index
const index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

// Get new camp form
const renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

// Post new camp
const createForm = async (req, res, next) => {
    const campground = await populateCampground(req, res);
    await campground.save();
    console.log(campground)
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

// Get campground details
const showCampground = async (req, res) => {
    const { id } = req.params;
    /** What if we only want a few specific fields returned for the populated documents? This can be accomplished by passing * the usual field name syntax as the second argument to the populate method: 
    * (src = https://mongoosejs.com/docs/populate.html)
    */
    const campground = await Campground.findById(id).populate("author", "username").populate({ path: "reviews", populate: { path: "author" } });
    // .populate({ path: "author", populate: { path: "username" } })
    // populate on the reviews property(which references Review model), and then populate the author property from that object
    // console.log(campground.author)
    if (!campground) {
        req.flash("error", "Cannot find that campground.");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
}

// Get campground edit form
const editForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash("error", "Cannot find that campground.");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground })
}

// Put campground update
const updateCampground = async (req, res) => {
    const { id } = req.params;
    // ... spreads data in the campground arry
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${id}`)
}

// Delete campground
const deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Campground deleted");
    res.redirect("/campgrounds");
}

module.exports = {
    index, renderNewForm, createForm, showCampground, editForm, updateCampground, deleteCampground
}


const populateCampground = async (req, res) => {
    const geoData = await geoCodeService.forwardGeocode({
        query: req.body.campground.location,
        limit: 5
    }).send()
    console.log(geoData.body.features[0].geometry)
    const campground = new Campground(req.body.campground);
    // geoData.body.features is an array
    campground.geometry = geoData.body.features[0].geometry;
    // Explicitly set this because id data wont be filled out via form
    campground.author = req.user._id;
    return campground;
}

/**
 const createForm = async (req, res, next) => {
    const geoData = await geoCodeService.forwardGeocode({
        query: req.body.campground.location,
        limit: 5
    }).send()
    const campground = new Campground(req.body.campground);
    // geoData.body.features is an array
    campground.geometry = geoData.body.features[0].geometry;
    // Explicitly set this because id data wont be filled out via form
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
} */