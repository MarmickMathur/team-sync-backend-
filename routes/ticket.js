const express = require("express");
const router = express();
const authMiddleware = require("../middleware/jwtmiddleware");
const { addTicket } = require("../controllers/ticket");

router.post("/", authMiddleware, addTicket);
router.get("/", (req, res) => {});

module.exports = router;
