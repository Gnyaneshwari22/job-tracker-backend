module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contact_name: DataTypes.STRING,
      job_title: DataTypes.STRING,
      company_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      industry: DataTypes.STRING,
      company_size: DataTypes.STRING,
      contact_email: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      location: DataTypes.STRING,
      job_link: DataTypes.TEXT,
      notes: DataTypes.TEXT,
    },
    {
      tableName: "companies",
      timestamps: true,
      underscored: true,
    }
  );

  return Company;
};
