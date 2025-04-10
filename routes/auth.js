const express = require("express");
const router = express();
const { signup, login } = require("../controllers/auth");
const authMiddleware = require("../middleware/jwtmiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/isAuthenticated", authMiddleware, (req, res) => {
  console.log("here");
  const user = req.user;
  delete user.password;
  res.json(user);
});

module.exports = router;
