const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const user = require("../models/user.js")
const passport =require("passport")
const {saveredirectUrl}=require("../utils/middleware.js")
const controleruser = require("../controllers/user.js")

router.get("/signup",controleruser.user)
//signup login-----------------------------------------------------------------
router.post("/signup",wrapAsync(controleruser.signup));

router  
    .route("/login")
    .get(controleruser.login)
    .post(saveredirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
controleruser.loginPost)

router.get("/logout",controleruser.logout)
module.exports = router;