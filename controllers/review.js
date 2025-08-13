const Review = require("../models/review"); 
const Listing = require("../models/listing"); 

module.exports.reviewcreated=async (req, res) => {
    let foundlisting = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    foundlisting.reviews.push(newreview);
    await newreview.save();
    await foundlisting.save();
     req.flash("success","review created")
    res.redirect(`/listing/${req.params.id}`);
}
module.exports.deletereview=async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId); 
     req.flash("success","review deleted")
    res.redirect(`/listing/${id}`);
}