const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    date_of_birth: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    gender: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    cmnd_number: {
      allowNull: false,
      unique: true,
      type: DataTypes.BIGINT
    },
    salary: {
      type: DataTypes.BIGINT
    },
    manager_id: {
      type: DataTypes.BIGINT
    },
    status: {
      type: DataTypes.INTEGER
    }
  });

  return User;
}