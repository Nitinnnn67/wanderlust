const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");

module.exports.index =async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listings/index.ejs", {alllisting});
}
module.exports.new=(req, res) => {
    res.render("listings/new.ejs");
}
module.exports.newlist=async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing); 
    newlisting.owner = req.user._id;
    newlisting.image = {url, filename};
    await newlisting.save();
    req.flash("success","new listing was created")
    res.redirect("/listing");  
}
module.exports.show=async (req, res) => {
    let {id} = req.params;
    const listingItem = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!listingItem) {
         req.flash("error","listing is not founded")
        return res.redirect("/listing")
    }
    res.render("listings/show.ejs", {listing: listingItem});
}
module.exports.edit=async (req, res) => {
    let {id} = req.params;
    const listingdetails = await Listing.findById(id); 
    if (!listingdetails) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listings/edit.ejs", {listing: listingdetails});
}
module.exports.update=async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); 
     req.flash("success","listing updated")
    res.redirect("/listing");
}
module.exports.delete=async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id); 
     req.flash("success","listing deleted")
    res.redirect("/listing");
}