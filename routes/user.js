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
} = require("../controllers/user");

router.patch("/", authMiddleware, patchUser);
router.post("/organization", authMiddleware, addOrganization);
router.post("/team", authMiddleware, addTeam);
router.get("/organizations", authMiddleware, getOrganization);
router.get("/teams", authMiddleware, getTeams);
router.get("/:email", getUserFromEmail);

module.exports = router;
