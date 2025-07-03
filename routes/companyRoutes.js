const express = require("express");
const router = express.Router();
const controller = require("../controllers/companyController");
const { validateToken } = require("../middleware/validateToken");

router.post("/", validateToken, controller.createCompany);
router.get("/", validateToken, controller.getCompanies);
router.get("/:id", validateToken, controller.getCompanyById);
router.put("/:id", validateToken, controller.updateCompany);
router.delete("/:id", validateToken, controller.deleteCompany);

module.exports = router;
