const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

app.use("/listings", listings);

app.use("/listings/:id/reviews", reviews);

//root-->

app.get("/", (req, res) => {
  res.send("Hi , i am root");
});

//error Handling-->

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
