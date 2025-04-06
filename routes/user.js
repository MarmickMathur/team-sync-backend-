const express = require("express");
const router = express();
const authMiddleware = require("../middleware/jwtmiddleware");
const {
  patchUser,
  getOrganization,
  addOrganization,
  getTeams,
  addTeam,
} = require("../controllers/user");

router.patch("/", authMiddleware, patchUser);
router.get("/organizations", authMiddleware, getOrganization);
router.get("/teams", authMiddleware, getTeams);
router.post("/organization", authMiddleware, addOrganization);

module.exports = router;
