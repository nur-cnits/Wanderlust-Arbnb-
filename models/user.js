const { string, required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  //passport-local-mongoose automatic added the usename ans password
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
