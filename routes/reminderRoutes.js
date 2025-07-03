const express = require("express");
const router = express.Router();
const {
  createReminder,
  getUserReminders,
} = require("../controllers/reminderController");
const { validateToken } = require("../middleware/validateToken");

router.post("/create", validateToken, createReminder);
router.get("/get", validateToken, getUserReminders);

module.exports = router;
