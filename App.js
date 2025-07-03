const express = require("express");
const cors = require("cors");
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

const db = require("./models"); // This imports models/index.js which exports { sequelize, User, Profile, ... }

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000", // for local testing
  "https://jobtrackerapplicationapp.netlify.app" // your deployed frontend
];

// Enable CORS for all routes
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use("/auth", authRoutes);
app.use("/applications", jobApplicationRoutes);
app.use("/reminders", reminderRoutes);
app.use("/profile", profileRoutes);
app.use("/companies", companyRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/applications", noteRoutes); // mounted under `/applications/:id/notes`
app.use("/saved-jobs", savedJobRoutes);

PORT = 5000;

sequelize
  .sync({ force: false }) // auto-sync all models
  .then(() => {
    console.log("Database synced.");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB sync error:", err));

app.listen(3001, "0.0.0.0", () => {
  console.log("Server running...");
});

require("./jobs/reminderCron");
require("./jobs/preNotifyReminders");
require("events").EventEmitter.defaultMaxListeners = 20;
