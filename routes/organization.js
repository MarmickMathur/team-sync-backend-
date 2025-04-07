const express = require("express");
const router = express();
const {
  getOrganization,
  getTeams,
  addTeam,
  addMember,
  getMembers,
  deleteMember,
  deleteTeam,
  patchMember,
} = require("../controllers/organization");
const authMiddleware = require("../middleware/jwtmiddleware");
const verifyOrg = require("../middleware/verifyOrg");

router.get("/", authMiddleware, getOrganization);
router.get("/teams", authMiddleware, getTeams);
router.get("/members", authMiddleware, getMembers);

router.post("/team", authMiddleware, verifyOrg, addTeam);
router.post("/member", authMiddleware, verifyOrg, addMember);

router.delete("/team", authMiddleware, verifyOrg, deleteTeam);
router.delete("/member", authMiddleware, verifyOrg, deleteMember);

router.patch("/member", authMiddleware, verifyOrg, patchMember);

module.exports = router;
