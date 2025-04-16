const express = require("express");
const router = express();
const authMiddleware = require("../middleware/jwtmiddleware");
const {
  addTicket,
  delTicket,
  patchTicket,
  getTicket,
  getlogs,
} = require("../controllers/ticket");
const verifyTicket = require("../middleware/verifyTicket");

router.get("/", authMiddleware, getTicket);
router.post("/", authMiddleware, addTicket);
router.get("/logs", authMiddleware, getlogs);
router.delete("/", authMiddleware, verifyTicket, delTicket);
router.patch("/", authMiddleware, verifyTicket, patchTicket);

module.exports = router;
