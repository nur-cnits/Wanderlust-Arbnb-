const express = require("express");
const router = express.Router({ mergeParams: true });
const warpAsync = require("../utils/warpAsync.js");
const Listing = require("../models/listing.js");
const { validationListing, isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//index route--->

router
  .route("/")
  .get(warpAsync(listingController.index))
  .post(
    isLoggedIn,
    validationListing,
    upload.single("listing[image]"),
    warpAsync(listingController.createListing)
  );

//new route-->

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(warpAsync(listingController.showListing))
  .patch(
    isLoggedIn,
    isOwner,
    validationListing,
    upload.single("listing[image]"),
    warpAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, warpAsync(listingController.distroyListing));

// edit--->

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  warpAsync(listingController.renderEditForm)
);

module.exports = router;
