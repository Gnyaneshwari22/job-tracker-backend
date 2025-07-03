const { Profile } = require("../models");
const { Op } = require("sequelize");

// GET /profile
exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: {
        user_id: req.user.userId,
        deleted_at: null,
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({ data: profile });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to fetch profile", error: err.message });
  }
};

// PUT /profile
exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: {
        user_id: req.user.userId,
        deleted_at: null,
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await profile.update(req.body);

    return res.status(200).json({ message: "Profile updated", data: profile });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to update profile", error: err.message });
  }
};

// DELETE /profile (soft delete)
exports.softDeleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: {
        user_id: req.user.userId,
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    await profile.destroy();

    return res.status(200).json({
      message: "Profile scheduled for deletion in 8 days",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to delete profile", error: err.message });
  }
};
