const express = require("express");
const router = express.Router();

const warpAsync = require("../utils/warpAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controller/users.js");

//signup-->>

router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(warpAsync(userController.signUp));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

//logout-->>

router.get("/logout", userController.logout);

module.exports = router;
