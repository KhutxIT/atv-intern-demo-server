const mongoose = require('mongoose');
const linkify = require('linkifyjs');
const { Post, CommentLike, User } = require('../../models/v2');
const { InvalidResourceException } = require('../../exceptions');
require('linkifyjs/plugins/hashtag')(linkify);
require('linkifyjs/plugins/mention')(linkify);

// thêm user vào mỗi service

function arrayRemove(array, value) {
  return array.filter(item => {
    return item._id.toString() !== value.toString();
  });
}
