const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const userController = require("../controllers/user");


/***********************************NEW ROUTES WAY**********************************/

router.route("/register")
    .get(userController.registerForm)
    .post(catchAsync(userController.registerUser));

router.route("/login")
    .get(userController.loginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;

/***********************************OLD ROUTES WAY**********************************

router.get("/register", userController.registerForm)

router.post('/register', catchAsync(userController.registerUser));


router.get("/login", userController.loginForm)

// passport.authenticate given by passport, calls req.login() behind the scenes
// passport.authenticate() is middleware which will authenticate the request. By default, when authentication succeeds, the req.user property is set to the authenticated user

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.login)

router.get("/logout", userController.logout);
* /

/***********************************************************************************/
