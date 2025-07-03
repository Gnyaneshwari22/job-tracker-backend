const cron = require("node-cron");
const { Op } = require("sequelize");
const { Reminder, User, JobApplication } = require("../models");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const reminders = await Reminder.findAll({
      where: {
        is_sent: false,
        notified: false,
        reminder_date: {
          [Op.between]: [
            oneDayFromNow,
            new Date(oneDayFromNow.getTime() + 60 * 1000),
          ],
        },
      },
      include: [
        { model: User, attributes: ["email"] },
        { model: JobApplication, attributes: ["job_title", "company_name"] },
      ],
    });

    for (const r of reminders) {
      if (!r.User?.email) continue;

      await sgMail.send({
        to: r.User.email,
        from: process.env.EMAIL_SENDER,
        subject: `🔔 Reminder Due Tomorrow: ${r.JobApplication?.job_title}`,
        text: r.message || `You have a reminder due tomorrow.`,
        html: `<p>${r.message}</p><p>⏰ Reminder time: ${new Date(
          r.reminder_date
        ).toLocaleString()}</p>`,
      });

      await r.update({ notified: true });
      console.log(`📧 Pre-reminder sent to ${r.User.email}`);
    }
  } catch (err) {
    console.error("❌ Pre-Reminder Cron Failed:", err.message || err);
  }
});
