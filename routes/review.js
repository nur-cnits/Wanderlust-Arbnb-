const express = require("express");
const router = express.Router({ mergeParams: true });
const warpAsync = require("../utils/warpAsync.js");
const reviewController = require("../controller/reviews.js");
const {
  validationReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");

//create review Route-->

router.post(
  "/",
  isLoggedIn,
  validationReview,
  warpAsync(reviewController.createReview)
);

//delete review Route-->

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  warpAsync(reviewController.distroyreview)
);

module.exports = router;
