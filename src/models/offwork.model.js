const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OffWork = sequelize.define('offwork', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    full_name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    team: {
      type: DataTypes.STRING,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    manager_name: {
      type: DataTypes.STRING,
    },
    manager_email: {
      type: DataTypes.STRING,
    },
    request_type: {
      type: DataTypes.STRING,
    },
    offwork_add_info: {
      type: DataTypes.STRING,
    },
    start_off_date: {
      allowNull: false,
      type: DataTypes.DATEONLY,
    },
    end_off_date: {
      type: DataTypes.DATEONLY,
    },
    start_working_time: {
      type: DataTypes.TIME,
    },
    end_working_time: {
      type: DataTypes.TIME,
    },
    compensation_plan: {
      type: DataTypes.STRING,
    },
    reasons: {
      type: DataTypes.STRING,
    },
    refused_reasons: {
      type: DataTypes.STRING,
    },
    manager_id: {
      allowNull: false,
      type: DataTypes.BIGINT,
    },
    state: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.INTEGER,
    },
  });

  return OffWork;
}