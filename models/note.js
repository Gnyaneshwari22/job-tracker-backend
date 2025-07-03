module.exports = (sequelize, DataTypes) => {
  const Note = sequelize.define(
    "Note",
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      job_application_id: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      tableName: "notes",
      timestamps: true,
      underscored: true,
    }
  );

  return Note;
};
