const { SavedJob } = require("../models");

exports.saveJob = async (req, res) => {
  try {
    const { job_title, job_url, company_id, notes } = req.body;

    const saved = await SavedJob.create({
      user_id: req.user.userId,
      job_title,
      job_url,
      company_id,
      notes,
    });

    return res.status(201).json({ message: "Job saved", data: saved });
  } catch (err) {
    return res.status(500).json({ message: "Save failed", error: err.message });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const jobs = await SavedJob.findAll({
      where: { user_id: req.user.userId },
      order: [["created_at", "DESC"]],
    });
    return res.status(200).json({ data: jobs });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch saved jobs", error: err.message });
  }
};

exports.deleteSavedJob = async (req, res) => {
  try {
    const job = await SavedJob.findByPk(req.params.id);

    if (!job || job.user_id !== req.user.userId)
      return res.status(404).json({ message: "Not found" });

    await job.destroy();
    return res.status(200).json({ message: "Deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Delete failed", error: err.message });
  }
};
