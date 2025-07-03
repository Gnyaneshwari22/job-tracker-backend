const express = require("express");
const router = express.Router();
const controller = require("../controllers/savedJobController");
const { validateToken } = require("../middleware/validateToken");

router.post("/", validateToken, controller.saveJob);
router.get("/", validateToken, controller.getSavedJobs);
router.delete("/:id", validateToken, controller.deleteSavedJob);

module.exports = router;
