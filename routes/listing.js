const express = require("express");
const router = express.Router();
// require wrapAsync ->
const wrapAsync = require("../utils/wrapAsync.js");
// requiring Listing Model
const Listing = require("../models/listing.js");
// require isLoggedIn middleware !
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
// require controller -> 
const listingController = require("../controllers/listing.js");
// to parse file data ! 
const multer  = require('multer')
// require storage
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

///////////////////////////////////////////////////////////////////////////////////////

router.route("/")
.get(wrapAsync(listingController.index)) // index route ->
.post(isLoggedIn,
     
    upload.single("listing[image]"), 
    wrapAsync(listingController.createListing)
);

// new route Create 
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing)) // Show Route ->
.put(isLoggedIn, isOwner,upload.single("listing[image]"),  validateListing, wrapAsync(listingController.updateListing)) // update Route ->
.delete(isLoggedIn, isOwner,  wrapAsync(listingController.destroyListing)); // DELETE ROUTE ->

// EDIT ROUTE ->
router.get("/:id/edit", isLoggedIn, isOwner,  wrapAsync(listingController.renderEditForm));

module.exports = router;




