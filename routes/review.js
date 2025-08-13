const express = require("express");
const router = express.Router({mergeParams: true}); // Fix 1: Add mergeParams
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const Review = require("../models/review"); 
const {isLoggedin}=require("../utils/middleware.js");
const reviewcontroller = require("../controllers/review.js")

router.post("/", isLoggedin, wrapAsync(reviewcontroller.reviewcreated))

router.delete("/:reviewId",isLoggedin, wrapAsync(reviewcontroller.deletereview));

module.exports = router;