const express = require("express");
const router = express.Router();
const { createNote, getNotes } = require("../controllers/noteController");
const { validateToken } = require("../middleware/validateToken");

router.post("/:id/notes", validateToken, createNote);
router.get("/:id/notes", validateToken, getNotes);

module.exports = router;
