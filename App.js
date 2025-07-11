const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const sequelize = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const profileRoutes = require("./routes/profileRoutes");
const companyRoutes = require("./routes/companyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const noteRoutes = require("./routes/noteRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");

const db = require("./models"); // Imports all models via models/index.js
const app = express();

// Middleware to parse JSON
app.use(express.json());

// 👇 Rate Limiting to avoid too many requests (especially useful in free-tier Render)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 👇 CORS setup to allow frontend hosted on Netlify
const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://jobtrackerapplicationapp.netlify.app", // deployed frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// 👇 Optional: handle preflight requests (important for CORS with credentials)
app.options(
  "*",
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// 👇 Route handlers
app.use("/auth", authRoutes);
app.use("/applications", jobApplicationRoutes);
app.use("/reminders", reminderRoutes);
app.use("/profile", profileRoutes);
app.use("/companies", companyRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/applications", noteRoutes); // noteRoutes should ideally be nested in noteRoutes file
app.use("/saved-jobs", savedJobRoutes);

// 👇 Port config for local + Render deployment
const PORT = process.env.PORT || 5000;

// 👇 DB sync and server start
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("✅ Database synced.");
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ DB sync error:", err));

// 👇 Cron jobs (if any)
require("./jobs/reminderCron");
require("./jobs/preNotifyReminders");

// 👇 Optional: increase max listeners if needed
require("events").EventEmitter.defaultMaxListeners = 20;
