const cloudinary = require('cloudinary');
const config = require('config');
const { cloudinary: cloudinaryConfig } = config;

const upload = async (file) => {
  const { filepath } = file;
  const result = await cloudinary.v2.uploader.upload(filepath, {
    resource_type: 'auto',
  });
  return result.secure_url;
};

const getSignedUrl = async (fileName) => {
  const data = cloudinary.v2.utils.generate_auth_token({});
  return data;
};

module.exports = {
  upload,
  getSignedUrl,
};
