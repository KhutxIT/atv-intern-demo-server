const cloudinary = require('cloudinary');
const config = require('config');

const { cloudinary: cloudinaryConfig } = config;

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
});

module.exports = (app) => app;
