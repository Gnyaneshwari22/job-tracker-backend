const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateToken");
const profileController = require("../controllers/profileController");

router.get("/", validateToken, profileController.getProfile);
router.put("/", validateToken, profileController.updateProfile);
router.delete("/", validateToken, profileController.softDeleteProfile);

module.exports = router;
