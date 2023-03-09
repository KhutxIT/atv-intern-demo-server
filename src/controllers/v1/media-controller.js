const { Media } = require('../../models/v2');
const { FileService } = require('../../services/v1');
const formidable = require('formidable');
const catchAsync = require('../../utils/catchasync-util');
const { InvalidResourceException } = require('../../exceptions');
const path = require('path');

const uploadMediaMiddleware = catchAsync(async (req, res, next) => {
  const form = new formidable.IncomingForm();
  const { files, fields } = await new Promise(async (resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({ files, fields });
    });
  });
  const file = files.file;
  if (!file) throw new InvalidResourceException('Invalid File');

  if (req.originalUrl.includes('profile-picture')) {
    if (!checkFileIsImage(file))
      throw new InvalidResourceException('Yêu cầu tải lên file ảnh');
  }

  const { mimetype } = file;
  let mediaType = 'file';
  if (mimetype.includes('video')) {
    mediaType = 'video';
  } else if (mimetype.includes('image')) {
    mediaType = 'image';
  }

  const result = await FileService.upload(file);
  const media = new Media({
    src: result,
    mediaType,
    mimeType: mimetype,
    title: file.originalFilename,
  });
  await media.save();
  req.fileSrcUrl = result;
  req.body = fields;

  next();
});

const uploadMedia = catchAsync(async (req, res, next) => {
  const form = new formidable.IncomingForm();
  const { files, fields } = await new Promise(async (resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({ files, fields });
    });
  });
  const file = files.file;
  if (!file) throw new InvalidResourceException('Invalid File');

  if (req.originalUrl.includes('profile-picture')) {
    if (!checkFileIsImage(file))
      throw new InvalidResourceException('Yêu cầu tải lên file ảnh');
  }

  const { mimetype } = file;
  let mediaType = 'file';
  if (mimetype.includes('video')) {
    mediaType = 'video';
  } else if (mimetype.includes('image')) {
    mediaType = 'image';
  }

  const result = await FileService.upload(file);
  const media = new Media({
    src: result,
    mediaType,
    mimeType: mimetype,
    title: file.originalFilename,
  });
  await media.save();
  req.fileSrcUrl = result;
  req.body = fields;

  res.json({
    data: {
      fileUrl: result,
    },
    success: true,
  });
});

const fetchSignedUrl = catchAsync(async (req, res) => {
  const result = FileService.getSignedUrl();

  res.json({
    data: result,
  });
});

const checkFileIsImage = (file) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(
    path.extname(file.originalFilename).toLowerCase()
  );
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  uploadMediaMiddleware,
  fetchSignedUrl,
  uploadMedia,
};
