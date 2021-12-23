const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, 
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    //logging: false
  }
);

const modelDefiners = [
	require('./user.model'),
	require('./attendance.model'),
  require('./role.model'),
  require('./offwork.model'),
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

module.exports = sequelize;
