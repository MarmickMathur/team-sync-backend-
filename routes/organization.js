const express = require("express");
const router = express();
const { getOrganization, getTeams, addTeam } = require("../controllers/organization");
const authMiddleware = require("../middleware/jwtmiddleware");
const verifyOrg = require("../middleware/verifyOrg");

router.get("/", authMiddleware, getOrganization);
router.get("/teams", authMiddleware, getTeams);
router.post("/team", authMiddleware, verifyOrg, addTeam);

module.exports = router;
