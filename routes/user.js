const express = require("express");
const router = express.Router();

// require user model
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// require controller user file ->
const userController = require("../controllers/users.js");

// signup routes!
router.route("/signup")
.get(userController.renderSignupForm) // get router for user !
.post(wrapAsync(userController.signup)); // signup route!


// login routes!
router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    // we will pass passport.authenticate as middleware in this route 
    // to authenticate the user.
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),userController.login);

// logout routes ! 
router.get("/logout", userController.logout);


module.exports = router;