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
const Review=require("./models/review");



const mongo_url ="mongodb://127.0.0.1:27017/wanderlust";
main().then((res)=>{
    console.log("connected-db");
})
.catch((err)=>{
    console.log(err);
});
async function main() {
   await mongoose.connect(mongo_url)
}
app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname, "public")));
// app.use((req,res,next)=>{
//     console.log(req)
//     next()
// })


app.use("/admin",(req,res,next)=>{
   let {token}=req.query;
   if(token==="eshin"){
    next()}
    throw new ExpressError(403,"Access for admin page is forbidden ")
    
})
app.use((err, req, res, next) => {
  let {status=500,message="something error"}=err;
  res.status(status).send(message);
  next(err);
})
app.get("/admin",(req,res)=>{
    res.send("data")
})
app.get("/",(req,res)=>{
    res.send("startedd...")
})

app.use("/listing",listingRoutes)
app.use("/listing/:id/reviews", reviewsRoutes)



app.use((req,res,next)=>{
next(new ExpressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
let {stausCode= 500,message="something went wrong"}=err;
res.render("listings/error.ejs",{stausCode,message})
})

app.listen(8080,()=>{
    console.log("listening on port 8080");
})