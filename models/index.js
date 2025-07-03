const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Load models
db.User = require("./user")(sequelize, Sequelize.DataTypes);
db.Profile = require("./profile")(sequelize, Sequelize.DataTypes);
db.JobApplication = require("./jobApplication")(sequelize, Sequelize.DataTypes);
db.Reminder = require("./reminder")(sequelize, Sequelize.DataTypes);
db.Company = require("./company")(sequelize, Sequelize.DataTypes);
db.Note = require("./note")(sequelize, Sequelize.DataTypes);
db.SavedJob = require("./savedJob")(sequelize, Sequelize.DataTypes);

// Define relationships
db.User.hasOne(db.Profile, { foreignKey: "user_id", as: "profile" });
db.Profile.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.JobApplication, { foreignKey: "user_id" });
db.JobApplication.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.Reminder, { foreignKey: "user_id" });
db.Reminder.belongsTo(db.User, { foreignKey: "user_id" });

db.JobApplication.hasMany(db.Reminder, { foreignKey: "job_application_id" });
db.Reminder.belongsTo(db.JobApplication, { foreignKey: "job_application_id" });

db.User.hasMany(db.Company, { foreignKey: "user_id" });
db.Company.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.Note, { foreignKey: "user_id" });
db.JobApplication.hasMany(db.Note, { foreignKey: "job_application_id" });
db.Note.belongsTo(db.User, { foreignKey: "user_id" });
db.Note.belongsTo(db.JobApplication, { foreignKey: "job_application_id" });

db.User.hasMany(db.SavedJob, { foreignKey: "user_id" });
db.Company.hasMany(db.SavedJob, { foreignKey: "company_id" });
db.SavedJob.belongsTo(db.User, { foreignKey: "user_id" });
db.SavedJob.belongsTo(db.Company, { foreignKey: "company_id" });

module.exports = db;
