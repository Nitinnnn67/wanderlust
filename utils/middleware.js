const Listing = require("../models/listing");

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you are not logged in")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveredirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isowner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    // Add null checks to prevent errors
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listing");
    }

    if (!listing.owner) {
        req.flash("error", "Listing has no owner!");
        return res.redirect("/listing");
    }

    if (!res.locals.currUser) {
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "you dont have permission to do this")
        return res.redirect(`/listing/${id}`)
    }
    next()
}