const Listing = require("../models/listing");

module.exports.index = async (req, res, next) => {
  let allLists = await Listing.find({});
  res.render("listings/index.ejs", { allLists });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  // nested populate
  const oneLists = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }, // author populate
    })
    .populate("owner");

  if (!oneLists) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show", { oneLists });
};

module.exports.createListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  newListing.image = { url, filename };
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing Created !");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "Listing you need that Dose not exists !");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { list, id });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", " Listing Update Successful !");
  res.redirect("/listings");
};

module.exports.distroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Delate Listing Successful !");
  res.redirect(`/listings`);
};
