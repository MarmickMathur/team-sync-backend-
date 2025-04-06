const express = require("express");
const router = express();
const authMiddleware = require("../middleware/jwtmiddleware");
const { patchUser, getOrganization } = require("../controllers/user");

router.patch("/", authMiddleware, patchUser);
router.get("/getOrganizations", authMiddleware, getOrganization);

module.exports = router;
