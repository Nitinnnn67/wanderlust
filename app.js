const express= require("express");
const app = express();
const mongoose=require("mongoose")
const listing=require("./models/listing")
const methodOverride = require("method-override")
const path = require("path");
const ejsMate=require("ejs-mate")

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

app.get("/",(req,res)=>{
    res.send("startedd...")
})

app.get("/listing",async (req,res)=>{
    const alllisting = await listing.find({});
    res.render("listings/index.ejs",{alllisting})
})

app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.get("/listing/:id",async (req,res)=>{
    let{id}=req.params;
    const listingItem = await listing.findById(id);
    res.render("listings/show.ejs",{listing:listingItem})
})

app.post("/listing/new",async (req,res)=>{
    const newlisting = new listing(req.body.listing)
    await newlisting.save();
    res.redirect("/listing");    
})

app.get("/listing/:id/edit",async(req,res)=>{
   let{id}=req.params;
    const listingdetails = await listing.findById(id);
    res.render("listings/edit.ejs",{listing:listingdetails})
})
app.put("/listing/:id",async(req,res)=>{
    let{id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing")
})

app.delete("/listing/:id",async(req,res)=>{
    let{id}=req.params;
    const listingdelete = await listing.findByIdAndDelete(id);
    res.redirect("")
})


app.get("/testlisting",async (req,res)=>{
    const samplelisting=new listing({
    title:"ramayana",
    description:"about ram bhagwan stories",
    price:600,
    location:"ayodhya",
    country:"india"
    })

await samplelisting.save();
console.log("save")
res.send("workinggg.... ")
});



app.listen(8080,()=>{
    console.log("listening on port 8080");
})