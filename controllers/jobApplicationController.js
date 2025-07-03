const { JobApplication } = require("../models");
const { Op } = require("sequelize");
const s3 = require("../config/aws");

const createJobApplication = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { company_name, job_title, application_date, status, notes } =
      req.body;
    const user_id = req.user.userId;

    const jobApp = await JobApplication.create({
      user_id,
      company_name,
      job_title,
      application_date,
      status,
      notes,
    });

    console.log("Job application created:", jobApp.id);
    return res
      .status(201)
      .json({ message: "Application created", data: jobApp });
  } catch (err) {
    console.error("Error creating job application:", err);
    return res.status(500).json({
      message: "Failed to create job application",
      error: err.message,
    });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const apps = await JobApplication.findAll({ where: { user_id } });

    console.log(`Fetched ${apps.length} applications`);
    return res.status(200).json({ data: apps });
  } catch (err) {
    console.error("Fetch error:", err);
    return res
      .status(500)
      .json({ message: "Could not fetch applications", error: err.message });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const app = await JobApplication.findByPk(req.params.id);
    if (!app || app.user_id !== req.user.userId) {
      return res
        .status(404)
        .json({ message: "Application not found or unauthorized" });
    }

    return res.status(200).json({ data: app });
  } catch (err) {
    console.error("Fetch by ID error:", err);
    return res
      .status(500)
      .json({ message: "Error fetching application", error: err.message });
  }
};

const updateApplication = async (req, res) => {
  try {
    const app = await JobApplication.findByPk(req.params.id);
    if (!app || app.user_id !== req.user.userId) {
      return res
        .status(404)
        .json({ message: "Application not found or unauthorized" });
    }

    const { job_title, company_name, status, application_date, notes } =
      req.body;

    const updated = await app.update({
      ...(job_title && { job_title }),
      ...(company_name && { company_name }),
      ...(status && { status }),
      ...(application_date && { application_date }),
      ...(notes && { notes }),
    });

    console.log("Application updated:", app.id);
    return res
      .status(200)
      .json({ message: "Application updated", data: updated });
  } catch (err) {
    console.error("Update error:", err);
    return res
      .status(500)
      .json({ message: "Error updating application", error: err.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const app = await JobApplication.findByPk(req.params.id);
    if (!app || app.user_id !== req.user.userId) {
      return res
        .status(404)
        .json({ message: "Application not found or unauthorized" });
    }

    await app.destroy();
    console.log("Deleted application:", req.params.id);

    return res.status(200).json({ message: "Application deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    return res
      .status(500)
      .json({ message: "Error deleting application", error: err.message });
  }
};

const uploadFiles = async (req, res) => {
  try {
    const jobApp = await JobApplication.findByPk(req.params.id);
    if (!jobApp || jobApp.user_id !== req.user.userId) {
      return res
        .status(404)
        .json({ message: "Application not found or unauthorized" });
    }

    const uploadToS3 = async (file, prefix) => {
      const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${prefix}/${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const result = await s3.upload(params).promise();
      return result.Location; // public URL
    };

    const resumeFile = req.files["resume"]?.[0];
    const coverFile = req.files["cover_letter"]?.[0];

    const resumeUrl = resumeFile
      ? await uploadToS3(resumeFile, "resumes")
      : null;
    const coverUrl = coverFile ? await uploadToS3(coverFile, "covers") : null;

    console.log("Uploaded files:", { resumeUrl, coverUrl });
    await jobApp.update({
      resume_file_path: resumeUrl,
      cover_letter_file_path: coverUrl,
    });

    return res.status(200).json({
      message: "Files uploaded to S3",
      data: {
        resume: resumeUrl,
        cover_letter: coverUrl,
      },
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res
      .status(500)
      .json({ message: "Upload failed", error: err.message });
  }
};

const searchApplications = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { keyword, status, from, to } = req.query;

    const conditions = { user_id };

    if (status) conditions.status = status;

    if (from && to) {
      conditions.application_date = {
        [Op.between]: [new Date(from), new Date(to)],
      };
    }

    if (keyword) {
      conditions[Op.or] = [
        { job_title: { [Op.like]: `%${keyword}%` } },
        { company_name: { [Op.like]: `%${keyword}%` } },
      ];
    }

    const results = await JobApplication.findAll({ where: conditions });
    return res.status(200).json({ data: results });
  } catch (err) {
    console.error("Search error:", err);
    return res
      .status(500)
      .json({ message: "Search failed", error: err.message });
  }
};

module.exports = {
  createJobApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  uploadFiles,
  searchApplications,
};
