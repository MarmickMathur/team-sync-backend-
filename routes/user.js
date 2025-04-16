const express = require("express");
const router = express();
const authMiddleware = require("../middleware/jwtmiddleware");
const {
  patchUser,
  getOrganization,
  addOrganization,
  getTeams,
  getUserFromEmail,
  addTeam,
  getTeamsCount,
  getInfo,
  getAssignedTickets,
  getOrgTeam,
} = require("../controllers/user");

router.use(authMiddleware);

router.patch("/", patchUser);
router.post("/organization", addOrganization);
router.post("/team", addTeam);
router.get("/organizations", getOrganization);
router.get("/allTeams", getTeams);
router.get("/teamsCount", getTeamsCount);
router.get("/dashInfo", getInfo);
router.get("/assignedTickets", getAssignedTickets);
router.get("/teams", authMiddleware, getOrgTeam);
router.get("/:email", getUserFromEmail);

module.exports = router;
