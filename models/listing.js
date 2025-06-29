const mongoose=require("mongoose")
const schema = mongoose.Schema;

const listingschema= new schema({
    title:{
        type:String,
    },
    description:String,
    images:{
        default:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/960px-London_Skyline_%28125508655%29.jpeg",
     type:String,
     set: (v) => 
        v==="" ? "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508655%29.jpeg/960px-London_Skyline_%28125508655%29.jpeg" 
        : v
    },
    price:Number,
    location:String,
    country:String,
})

const listing = mongoose.model("listing",listingschema)
module.exports = listing;