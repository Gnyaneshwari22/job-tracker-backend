const cron = require("node-cron");
const { Op } = require("sequelize");
const { Reminder, User, JobApplication } = require("../models");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// 🔁 Combined cron: every 1 minute
cron.schedule("*/1 * * * *", async () => {
  const now = new Date();
  const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const oneDayFromNowEnd = new Date(oneDayFromNow.getTime() + 60 * 1000);

  console.log("⏰ Running unified reminder cron...");

  try {
    // 1️⃣ Pre-Reminder (Due Tomorrow)
    const upcoming = await Reminder.findAll({
      where: {
        is_sent: false,
        notified: false,
        reminder_date: {
          [Op.between]: [oneDayFromNow, oneDayFromNowEnd],
        },
      },
      include: [
        { model: User, attributes: ["email"] },
        { model: JobApplication, attributes: ["job_title", "company_name"] },
      ],
    });

    for (const r of upcoming) {
      if (!r.User?.email) continue;

      await sgMail.send({
        to: r.User.email,
        from: process.env.EMAIL_SENDER,
        subject: `🔔 Reminder Due Tomorrow: ${r.JobApplication?.job_title}`,
        text: r.message || "You have a reminder due tomorrow.",
        html: `<p>${r.message || "You have a reminder due tomorrow."}</p>
                <p>⏰ Scheduled for: ${new Date(
                  r.reminder_date
                ).toLocaleString()}</p>`,
      });

      await r.update({ notified: true });
      console.log(`📧 Pre-reminder sent to ${r.User.email}`);
    }

    // 2️⃣ Final Reminder (Due Now)
    const dueNow = await Reminder.findAll({
      where: {
        is_sent: false,
        reminder_date: { [Op.lte]: now },
      },
      include: [
        { model: User, attributes: ["email"] },
        { model: JobApplication, attributes: ["job_title", "company_name"] },
      ],
    });

    for (const r of dueNow) {
      if (!r.User?.email) continue;

      await sgMail.send({
        to: r.User.email,
        from: process.env.EMAIL_SENDER,
        subject: `⏰ Reminder: Follow up on ${r.JobApplication?.job_title}`,
        text: r.message || "Don't forget to follow up.",
        html: `<p>${
          r.message || "Don't forget to follow up on your job application."
        }</p>`,
      });

      await r.update({ is_sent: true });
      console.log(`✅ Final reminder sent to ${r.User.email}`);
    }

    if (!upcoming.length && !dueNow.length)
      console.log("📭 No reminders or pre-reminders due now.");
  } catch (err) {
    console.error("❌ Unified reminder cron failed:", err.message || err);
  }
});
