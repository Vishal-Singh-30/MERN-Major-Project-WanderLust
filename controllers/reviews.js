// require review model !
const Review = require("../models/review");
// requiring Listing Model
const Listing = require("../models/listing.js");


// callbacks ->
module.exports.createReview = async(req, res) => {
    // now for storing reviews we need to require review model.
    // 1st we will access the listing whoese id is in the url
    let {id} = req.params;
    // finding id
    let listing = await Listing.findById(id);
    // now we want to create new review
    let newReview = new Review(req.body.review);
    // store author with review.
    newReview.author = req.user._id;

    // pushing new review in array of listing 
    listing.reviews.push(newReview);
    // save
    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req, res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};