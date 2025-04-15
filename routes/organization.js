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
  patchOrg,
  getTeamCount,
} = require("../controllers/organization");
const authMiddleware = require("../middleware/jwtmiddleware");
const verifyOrg = require("../middleware/verifyOrg");

router.get("/teams", authMiddleware, getTeams);
router.get("/members", authMiddleware, getMembers);
router.get("/teamCount", authMiddleware, verifyOrg, getTeamCount);
router.get("/", authMiddleware, getOrganization);

router.post("/team", authMiddleware, verifyOrg, addTeam);
router.post("/member", authMiddleware, verifyOrg, addMember);

router.delete("/team", authMiddleware, verifyOrg, deleteTeam);
router.delete("/member", authMiddleware, verifyOrg, deleteMember);

router.patch("/member", authMiddleware, verifyOrg, patchMember);
router.patch("/", authMiddleware, verifyOrg, patchOrg);

module.exports = router;
