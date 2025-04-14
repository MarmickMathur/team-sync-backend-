const express = require("express");
const router = express();
const authMiddleware = require("../middleware/jwtmiddleware");
const verfiyTicket = require("../middleware/verifyTicket");
const {
  addTicket,
  delTicket,
  patchTicket,
  getTicket,
} = require("../controllers/ticket");

router.get("/", authMiddleware, getTicket);
router.post("/", authMiddleware, addTicket);
router.delete("/", authMiddleware, verfiyTicket, delTicket);
router.patch("/", authMiddleware, verfiyTicket, patchTicket);

module.exports = router;
