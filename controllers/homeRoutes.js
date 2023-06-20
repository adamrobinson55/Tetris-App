const router = require("express").Router();
const { Comment, User } = require("../models");
const withAuth = require("../utils/auth");
const { route } = require("./api");

router.get("/", async (req, res) => {
    res.render("homepage", {
      logged_in: req.session.logged_in,
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("signup");
});

router.get("/game", withAuth, (req, res) => {
  res.render("game");
});

router.get('/profile', withAuth, (req, res)=>{
  res.render('profile')
});

router.get('/homepage', withAuth, (req, res)=>{
  res.render('homepage')
});

module.exports = router;