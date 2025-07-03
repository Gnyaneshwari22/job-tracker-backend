module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Profile",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      frstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      phone: DataTypes.STRING,
      skills: DataTypes.TEXT,
      current_location: DataTypes.STRING,
      experience: DataTypes.TEXT,
      portfolio_url: DataTypes.STRING,
      career_goals: DataTypes.TEXT,
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },

    {
      tableName: "profiles",
      timestamps: true,
      underscored: true,
    }
  );
};
