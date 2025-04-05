const express = require("express");
const router = express();
const { signup, login } = require("../controllers/auth");

router.get("/signup", signup);

router.get("/login", login);

module.exports = router;
