const mongoose=require("mongoose")
const schema = mongoose.Schema;

const listingschema= new schema({
    title:{
        type:String,
    },
    description:String,
    image:{
        url: {
            type: String,
        },
        filename: {
            type: String,
            default: "listingimage"
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews : [{
        type : schema.Types.ObjectId,
        ref :"Review",
}],
    owner :{
        type:schema.Types.ObjectId,
        ref :"User"
    }
})

const listing = mongoose.model("listing",listingschema)
module.exports = listing;