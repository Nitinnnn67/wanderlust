const mongoose= require("mongoose");
const {data: initdata}=require("./data.js")
const listing = require("../models/listing.js")

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

initdb = async()=>{
    await listing.deleteMany({});
    const dataWithOwner = initdata.map((obj)=>({
        ...obj , owner:"688f40774f4b9ef1f0d20fc3"
    }));
    await listing.insertMany(dataWithOwner);

    console.log("data was initialized")
}

initdb();