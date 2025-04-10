const express = require("express");
const router = express();
const authMiddleware = require("../middleware/jwtmiddleware");
const verfiyTicket = require("../middleware/verifyTicket");
const { addTicket, delTicket } = require("../controllers/ticket");

router.post("/", authMiddleware, addTicket);
router.delete("/", authMiddleware, verfiyTicket, delTicket);
router.get("/", (req, res) => {});

module.exports = router;
