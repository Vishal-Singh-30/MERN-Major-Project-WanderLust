// initialization of database with sample data. 
// logic here ->
const mongoose = require("mongoose");
// require data ->
const initData = require("./data.js");
// require model ->
const Listing = require("../models/listing.js");

// for stablishing connection with database.
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

// create function to delete previous data and add new data.
const initDB = async () => {
    // first we will clean the database if there is already data.
    await Listing.deleteMany({});
    // we added owner property in listing schema here ! 
     initData.data = initData.data.map((obj)=>({...obj, owner: "6683e3aa4aab7e9ba0c16a42"}));
    // We exported init data as object and data as key.
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();





