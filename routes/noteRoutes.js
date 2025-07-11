const express = require("express");
const router = express.Router();
const { createNote, getNotes } = require("../controllers/noteController");
const { validateToken } = require("../middleware/validateToken");

router.post("/", validateToken, createNote);
router.get("/", validateToken, getNotes);

module.exports = router;
