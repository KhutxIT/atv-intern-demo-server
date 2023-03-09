const config = require('config');
const mongoose = require('mongoose');

const { database: dbConfig } = config;

const connectDB = async () => {
  try {
    const con = await mongoose.connect(dbConfig.url, {
      autoIndex: true,
    });

    console.log(`Connected database: ${con.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
};
