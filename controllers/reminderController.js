const { Reminder } = require("../models");

const createReminder = async (req, res) => {
  try {
    const { job_application_id, reminder_date, message } = req.body;
    const user_id = req.user.userId;

    const reminder = await Reminder.create({
      user_id,
      job_application_id,
      reminder_date,
      message,
    });

    console.log("Reminder created:", reminder.id);
    return res
      .status(201)
      .json({ message: "Reminder created", data: reminder });
  } catch (err) {
    console.error("Reminder creation error:", err);
    return res
      .status(500)
      .json({ message: "Failed to create reminder", error: err.message });
  }
};

const getUserReminders = async (req, res) => {
  try {
    const user_id = req.user.userId;

    const reminders = await Reminder.findAll({ where: { user_id } });
    console.log(`Fetched ${reminders.length} reminders`);

    return res.status(200).json({ data: reminders });
  } catch (err) {
    console.error("Fetch reminder error:", err);
    return res
      .status(500)
      .json({ message: "Failed to fetch reminders", error: err.message });
  }
};

module.exports = { createReminder, getUserReminders };
