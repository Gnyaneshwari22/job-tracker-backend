module.exports = (sequelize, DataTypes) => {
  const JobApplication = sequelize.define(
    "JobApplication",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      company_name: DataTypes.STRING,
      job_title: DataTypes.STRING,
      application_date: DataTypes.DATEONLY,
      status: {
        type: DataTypes.ENUM(
          "applied",
          "interviewed",
          "offered",
          "rejected",
          "hired"
        ),
        defaultValue: "applied",
      },
      notes: DataTypes.TEXT,
      resume_file_path: DataTypes.STRING,
      cover_letter_file_path: DataTypes.STRING,
    },
    {
      tableName: "job_applications",
      timestamps: true,
      underscored: true,
    }
  );

  return JobApplication;
};
