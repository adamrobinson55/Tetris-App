const router = require("express").Router();
const { Comment, User } = require("../models");
const withAuth = require("../utils/auth");


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

router.get("/highscores", async (req, res) => {
  try {
    const userData = await User.findAll({
      attributes: ['name', 'hiscore'],
      order: [["hiscore", "DESC"]],
    });

    const users = userData.map((user) =>
      user.get({ plain: true })
    );
    console.log(users)
    res.render("highscores", {
      users,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/profile', withAuth, (req, res)=>{
  res.render("profile", {
    logged_in: req.session.logged_in,
  });
});

router.get('/game', withAuth, (req, res)=>{
  res.render("game", {
    logged_in: req.session.logged_in,
  });
});

module.exports = router;
