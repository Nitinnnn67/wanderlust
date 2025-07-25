const mongoose=require("mongoose")
const schema = mongoose.Schema;

const reviewschema= new schema({
    comment : String,
    rating : Number,
    createdAt : {
        type : Date,
        default : Date.now,
    }
})

module.exports = mongoose.model("Review",reviewschema);