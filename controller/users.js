const User = require("../models/user.js");

module.exports.renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = await User({ email, username });
    const registerdUser = await User.register(newUser, password); //save in mongo
    req.login(registerdUser, (err) => {
      //if i sign up then login auto
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to wanderlust");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Wellcome to WonderLust");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged Out !");
    res.redirect("/listings");
  });
};
