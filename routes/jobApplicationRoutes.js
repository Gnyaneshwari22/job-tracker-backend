const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { validateToken } = require("../middleware/validateToken");
const {
  createJobApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  uploadFiles,
  searchApplications,
} = require("../controllers/jobApplicationController");

router.post("/create", validateToken, createJobApplication);
router.get("/get", validateToken, getAllApplications);
router.get("/getById/:id", validateToken, getApplicationById);
router.put("/update/:id", validateToken, updateApplication);
router.delete("/delete/:id", validateToken, deleteApplication);

router.post(
  "/:id/upload",
  validateToken,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "cover_letter", maxCount: 1 },
  ]),
  uploadFiles
);

router.get("/search", validateToken, searchApplications);

module.exports = router;
