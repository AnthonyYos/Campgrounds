const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor } = require("../utils/userPermissions");
const { validateCampground } = require("../utils/formValidation");
const campgroundsContoller = require("../controllers/campgrounds");


/***********************************NEW ROUTES WAY**********************************/
router.route("/")
    .get(catchAsync(campgroundsContoller.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgroundsContoller.createForm));

router.get("/new", isLoggedIn, campgroundsContoller.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgroundsContoller.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsContoller.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundsContoller.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundsContoller.editForm));

/***********************************OLD ROUTES WAY**********************************
// Campground index
router.get("/", catchAsync(campgroundsContoller.index))

// Get new camp form
router.get('/new', isLoggedIn, campgroundsContoller.renderNewForm)

// Post new camp
router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundsContoller.createForm))

// Get campground details
router.get("/:id", catchAsync(campgroundsContoller.showCampground))

// Get campground edit form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundsContoller.editForm))

// Put campground update
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsContoller.updateCampground))

// Delete campground
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgroundsContoller.deleteCampground))

/***********************************OLD ROUTES WAY**********************************/


module.exports = router;