const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
// require ExpressError Class ->
const ExpressError = require("./utils/ExpressError.js");
// require server side validation schema .
const {listingSchema} = require("./schema.js");
// require server side validation schema .
const { reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        // originalURL SAVE 
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create a lisitng!");
        return res.redirect("/login");
    }
        next();
};


// here we will save originalUrl with help of local
// so it wont get deleted after logging in as 
// passport delets the session after logging in ! 
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


module.exports.isOwner =  async (req,res,next) => {
    let {id} = req.params;
    // require listing model for this 
    let listing  = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// validate listing function of joi
module.exports.validateListing = (req,res,next) => {
    //validating server side schema.
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


// review schema function ->
module.exports.validateReview = (req,res,next) => {
    //validating server side schema.
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.isReviewAuthor =  async (req,res,next) => {
    let {id, reviewId} = req.params;
    // require listing model for this 
    let review  = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review!");
        // redirect to show page  !
        return res.redirect(`/listings/${id}`);
    }
    next();
};
