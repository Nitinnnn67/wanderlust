const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const Review = require("../models/review"); 

router.get("/", wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs", {alllisting});
}));

router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

router.post("/new", wrapAsync(async (req, res) => {
    const newlisting = new Listing(req.body.listing); 
    await newlisting.save();
    res.redirect("/listing");    
})); 

router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listingItem = await Listing.findById(id).populate("reviews");
    if (!listingItem) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/show.ejs", {listing: listingItem});
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listingdetails = await Listing.findById(id); 
    if (!listingdetails) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit.ejs", {listing: listingdetails});
}));

router.put("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); 
    res.redirect("/listing");
}));

router.delete("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id); 
    res.redirect("/listing");
}));



module.exports = router; 