const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('role', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false
  });

  return Role;
}