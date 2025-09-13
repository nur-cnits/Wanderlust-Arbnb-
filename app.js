const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("../Project-1/models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const warpAsync = require("./utils/warpAsync.js");
const ExpressError = require("./utils/ExpressError.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

//connect with mongo-->

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

app.get("/", (req, res) => {
  res.send("Hi , i am root");
});

app.get(
  "/listings",
  warpAsync(async (req, res, next) => {
    let allLists = await Listing.find({});
    res.render("listings/index.ejs", { allLists });
  })
);

//create route-->>

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post("/listings", async (req, res) => {
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  await newListing.save();

  res.redirect("/listings");
});

// edit-->

app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  res.render("listings/edit.ejs", { list, id });
});

// update-- >
app.patch("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let newlist = req.body.listing;
  await Listing.findByIdAndUpdate(
    id,
    { ...newlist },
    { runValidators: true, new: true }
  ); //distract newList
  res.redirect("/listings");
});

// distroy route-->

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id, { runValidators: true, new: true });
  res.redirect("/listings");
});

//show route-->

app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let oneLists = await Listing.findById(id);
  res.render("listings/show.ejs", { oneLists });
});

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something is wrong" } = err;
  res.render("error.ejs", { statusCode, message });
});

app.listen(8080, () => {
  console.log("Server is connected on port 8080");
});
