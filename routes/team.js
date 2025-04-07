const express = require("express");
const router = express();
const {
  getTeam,
  addMember,
  getMembers,
  deleteMember,
  patchMember,
} = require("../controllers/team");

const authMiddleware = require("../middleware/jwtmiddleware");
const verifyTeam = require("../middleware/verifyTeam");

//also add patch route for team
router.get("/", authMiddleware, getTeam);
router.get("/members", authMiddleware, getMembers);

router.post("/member", authMiddleware, verifyTeam, addMember);

router.delete("/member", authMiddleware, verifyTeam, deleteMember);

router.patch("/member", authMiddleware, verifyTeam, patchMember);

module.exports = router;
