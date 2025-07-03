const express = require("express");
const router = express.Router();
const { getOverviewStats } = require("../controllers/dashboardController");
const { validateToken } = require("../middleware/validateToken");

router.get("/overview", validateToken, getOverviewStats);

module.exports = router;
