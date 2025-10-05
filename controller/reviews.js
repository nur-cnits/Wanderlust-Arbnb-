const Listing = require("../models/listing");
const Review = require("../models/reviews");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview._id);
  await newReview.save();
  await listing.save();
  req.flash("success", "Review Added Successful !");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.distroyreview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Delate Review Successful !");
  res.redirect(`/listings/${id}`);
};
