module.exports = (sequelize, DataTypes) => {
  const SavedJob = sequelize.define(
    "SavedJob",
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      company_id: DataTypes.INTEGER,
      job_title: DataTypes.STRING,
      job_url: DataTypes.TEXT,
      notes: DataTypes.TEXT,
      saved_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "saved_jobs",
      timestamps: true,
      underscored: true,
    }
  );

  return SavedJob;
};
