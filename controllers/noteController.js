const { Note } = require("../models");

exports.createNote = async (req, res) => {
  try {
    const note = await Note.create({
      user_id: req.user.userId,
      job_application_id: req.params.id,
      content: req.body.content,
    });

    return res.status(201).json({ message: "Note added", data: note });
  } catch (err) {
    console.error("Note creation failed:", err);
    return res
      .status(500)
      .json({ message: "Could not create note", error: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: {
        user_id: req.user.userId,
        job_application_id: req.params.id,
      },
    });

    return res.status(200).json({ data: notes });
  } catch (err) {
    console.error("Fetch notes failed:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch notes", error: err.message });
  }
};
