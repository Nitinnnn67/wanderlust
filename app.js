const express= require("express");
const app = express();
const mongoose=require("mongoose")
const listing=require("./models/listing")
const methodOverride = require("method-override")
const path = require("path");
const ejsMate=require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")

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
});

app.get("/admin",(req,res)=>{
    res.send("data")
})

app.get("/",(req,res)=>{
    res.send("startedd...")
})

app.get("/listing", wrapAsync(async (req,res,next)=>{
    if(!listing){
        throw new ExpressError(400,"send valid data")
    }
     const alllisting = await listing.find({});
    res.render("listings/index.ejs",{alllisting}) 
}));

app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.get("/listing/:id",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    const listingItem = await listing.findById(id);
    res.render("listings/show.ejs",{listing:listingItem})
}))
app.post("/listing/new", wrapAsync(async (req,res)=>{
    const newlisting = new listing(req.body.listing)
    await newlisting.save();
    res.redirect("/listing");    
}));;

app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
   let{id}=req.params;
    const listingdetails = await listing.findById(id);
    res.render("listings/edit.ejs",{listing:listingdetails})
}))
app.put("/listing/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing")
}))

app.delete("/listing/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listingdelete = await listing.findByIdAndDelete(id);
    res.redirect("/listing")
}))


app.get("/testlisting",wrapAsync(async (req,res)=>{
    const samplelisting=new listing({
    title:"ramayana",
    description:"about ram bhagwan stories",
    image: {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/960px-London_Skyline_%28125508655%29.jpeg",
        filename: "listingimage"
    },
    price:600,
    location:"ayodhya",
    country:"india"
    })

await samplelisting.save();
console.log("save")
res.send("workinggg.... ")
}));

app.use((req,res,next)=>{
next(new ExpressError(404,"page not found"))

})
app.use((err,req,res,next)=>{
let {stausCode=500,message="something went wrong"}=err;
res.render("listings/error.ejs",{stausCode,message})
// res.status(stausCode).send(message);
})

app.listen(8080,()=>{
    console.log("listening on port 8080");
})