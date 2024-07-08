const { ref } = require("joi");
const mongoose = require("mongoose");
// store mongoose.Schema in a variable. -> 
// so we dont have to write it multiple times.
const Schema = mongoose.Schema;


// require Review model
const Review = require("./review.js");

// create listing model schema.
const listingSchema = new Schema({
    title: {
       type: String,
       required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        },
    },
});

// .post  mongoose middleware.
listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing ){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
    
});


// create model called "Listing"
const Listing = mongoose.model("Listing", listingSchema);
// export the model
module.exports =Listing;




