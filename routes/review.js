const express = require("express");
const router = express.Router({mergeParams: true}); // Fix 1: Add mergeParams
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const Review = require("../models/review"); 


router.post("/", wrapAsync(async (req, res) => {
    let foundlisting = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    foundlisting.reviews.push(newreview);
    
    await newreview.save();
    await foundlisting.save();
    res.redirect(`/listing/${req.params.id}`);
}))
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId); 
    res.redirect(`/listing/${id}`);
}));

module.exports = router;