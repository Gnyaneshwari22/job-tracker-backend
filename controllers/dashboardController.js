const { JobApplication } = require("../models");
const { Op } = require("sequelize");

exports.getOverviewStats = async (req, res) => {
  try {
    const user_id = req.user.userId;

    // Total applications
    const total = await JobApplication.count({ where: { user_id } });

    // Status breakdown (group by status)
    const statusCounts = await JobApplication.findAll({
      where: { user_id },
      attributes: [
        "status",
        [JobApplication.sequelize.fn("COUNT", "status"), "count"],
      ],
      group: ["status"],
    });

    // Timeline (last 30 days)
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(today.getDate() - 30);

    const timeline = await JobApplication.findAll({
      where: {
        user_id,
        application_date: {
          [Op.between]: [lastMonth, today],
        },
      },
      attributes: [
        "application_date",
        [JobApplication.sequelize.fn("COUNT", "*"), "count"],
      ],
      group: ["application_date"],
      order: [["application_date", "ASC"]],
    });

    return res.status(200).json({
      total_applications: total,
      status_summary: statusCounts,
      recent_activity: timeline,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch dashboard stats", error: err.message });
  }
};
