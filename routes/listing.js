const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing");
const Review = require("../models/review"); 
const {isLoggedin,isowner}=require("../utils/middleware.js")
const controlerslisting=require("../controllers/listing.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })


router
    .route("/")
    .get( wrapAsync(controlerslisting.index))
    
      

router
    .route("/new")
    .get( isLoggedin,controlerslisting.new)
    .post(isLoggedin, upload.single('listing[image]'), wrapAsync(controlerslisting.newlist))
    // .post( upload.single('listing[image]'),(req,res)=>{
    //     res.send(req.file)
    // })

router
    .route("/:id")
    .get( wrapAsync(controlerslisting.show))
    .put(isLoggedin,isowner,wrapAsync(controlerslisting.update))
    .delete(isLoggedin, isowner,wrapAsync(controlerslisting.delete))

router.get("/:id/edit",isLoggedin, isowner,wrapAsync(controlerslisting.edit));




module.exports = router; 