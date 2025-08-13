if(process.env.NODE_ENV != "production" ){
require('dotenv').config()}

const express= require("express");
const app = express();
const mongoose=require("mongoose")
const Listing=require("./models/listing")
const methodOverride = require("method-override")
const path = require("path");
const ejsMate=require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const listingRoutes = require("./routes/listing.js")
const reviewsRoutes = require("./routes/review.js")
const session=require("express-session");
const mongostore=require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport");
const LocalStrategy=require("passport-local");
const user = require("./models/user.js")
const Review=require("./models/review");
const userRoute=require("./routes/user.js");
const MongoStore = require('connect-mongo');


// MongoDB connection with fallback
// const mongo_url_local ="mongodb://127.0.0.1:27017/wanderlust";
let dburl = process.env.MONGO_DB_ATLAS ;

main().then((res)=>{
    console.log("connected to MongoDB successfully");
})
.catch((err)=>{
    console.log("MongoDB connection failed:", err.message);
    console.log("Trying local MongoDB...");
    
    // Fallback to local MongoDB
    mongoose.connect(mongo_url_local)
        .then(() => console.log("Connected to local MongoDB"))
        .catch((localErr) => console.log("Local MongoDB also failed:", localErr.message));
});

async function main() {
   await mongoose.connect(dburl)
}

app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname, "public")));

// Fixed MongoStore configuration
const store = MongoStore.create({
    mongoUrl: dburl,  // Changed from 'mongourl' to 'mongoUrl'
    crypto: {
        secret: "mysupersecretcode"
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {  // Added 'err' parameter
    console.log("MongoStore error:", err)
})

const sessionOption={
    store,
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true, 
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}

app.use(session(sessionOption));
app.use(flash()); 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()))
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/admin",(req,res)=>{
    res.send("data")
})
app.get("/",(req,res)=>{
    res.send("startedd...")
})

app.use("/listing",listingRoutes)
app.use("/listing/:id/reviews", reviewsRoutes)
app.use("/", userRoute)

app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
    if (res.headersSent) {
        return next(err);
    }
    let {statusCode = 500, message = "something went wrong"} = err;
    res.status(statusCode).render("listings/error.ejs", {statusCode, message});
})

app.listen(8080,()=>{
    console.log("listening on port 8080");
})