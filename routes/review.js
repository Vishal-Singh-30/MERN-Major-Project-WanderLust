const express = require("express");
const router = express.Router({mergeParams: true});
// to work review from here we need to require these things ->
// require wrapAsync ->
const wrapAsync = require("../utils/wrapAsync.js");
// require ExpressError Class ->
const ExpressError = require("../utils/ExpressError.js");
// require review model.
const Review = require("../models/review.js");
// requiring Listing Model
const Listing = require("../models/listing.js");
// require validate review middleware
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
// require controller review file ->
const reviewController = require("../controllers/reviews.js");



///////////////////////////////////////////////////////////////////////////////////////////

// reviews 

//Post route 
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));
// DELETE REVIEW ROUTE ->
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;