const { Company } = require("../models");

exports.createCompany = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const company = await Company.create({ ...req.body, user_id });
    return res.status(201).json({ message: "Company added", data: company });
  } catch (err) {
    console.error("Create company error:", err);
    return res
      .status(500)
      .json({ message: "Failed to add company", error: err.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      where: { user_id: req.user.userId },
    });
    return res.status(200).json({ data: companies });
  } catch (err) {
    console.error("Fetch companies error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch companies", error: err.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company || company.user_id !== req.user.userId) {
      return res
        .status(404)
        .json({ message: "Company not found or unauthorized" });
    }

    return res.status(200).json({ data: company });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error getting company", error: err.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company || company.user_id !== req.user.userId) {
      return res
        .status(404)
        .json({ message: "Company not found or unauthorized" });
    }

    await company.update(req.body);
    return res.status(200).json({ message: "Company updated", data: company });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to update company", error: err.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    if (!company || company.user_id !== req.user.userId) {
      return res
        .status(404)
        .json({ message: "Company not found or unauthorized" });
    }

    await company.destroy();
    return res.status(200).json({ message: "Company deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delete company", error: err.message });
  }
};
