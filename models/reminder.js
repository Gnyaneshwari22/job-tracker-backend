module.exports = (sequelize, DataTypes) => {
  const Reminder = sequelize.define(
    "Reminder",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      job_application_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reminder_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      message: DataTypes.STRING,
      is_sent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      notified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "reminders",
      timestamps: true,
      underscored: true,
    }
  );

  return Reminder;
};
