const mongoose = require("mongoose");
const allData = require("./data.js");
const Listing = require("../models/listing.js");

//connect with mongo

const mongo_Url = "mongodb://127.0.0.1:27017/Wanderlust";

main()
  .then(() => {
    console.log("Connected with Mongo");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_Url);
}

const initDb = async () => {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(allData.data);
    console.log("all data is insert");
    console.log(allData.data);
  } catch (err) {
    console.error("Error inserting data:", err);
  }
};

initDb();
