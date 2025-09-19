const express = require("express");
const router = express.Router();
const warpAsync = require("../utils/warpAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

const validationListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//index route-->

router.get(
  "/",
  warpAsync(async (req, res, next) => {
    let allLists = await Listing.find({});
    res.render("listings/index.ejs", { allLists });
  })
);

//create route-->

router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/",
  validationListing,
  warpAsync(async (req, res) => {
    let listing = req.body.listing;
    console.log(listing);
    const newListing = new Listing(listing);
    await newListing.save();

    res.redirect("/listings");
  })
);

// edit--->

router.get(
  "/:id/edit",
  warpAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    res.render("listings/edit.ejs", { list, id });
  })
);

// update-- >

router.patch(
  "/:id",
  validationListing,
  warpAsync(async (req, res) => {
    let { id } = req.params;
    let newlist = req.body.listing;
    await Listing.findByIdAndUpdate(
      id,
      { ...newlist },
      { runValidators: true, new: true }
    ); //distract newList
    res.redirect("/listings");
  })
);

// distroy route-->

router.delete(
  "/:id",
  warpAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

//show route-->

router.get(
  "/:id",
  warpAsync(async (req, res) => {
    let { id } = req.params;
    let oneLists = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { oneLists });
  })
);

module.exports = router;
