const express = require("express");
const router = express();
const { getOrganization } = require("../controllers/organization");

router.get("/organization", getOrganization);

module.exports = router;
