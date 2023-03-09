const moment = require('moment/moment');
const Mongoose = require('mongoose');
const { VIETNAM_DATE_FORMAT } = require('../../common/constant/DateFormat');
const { Schema } = Mongoose;

const SystemOperationSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  totalSignIn: {
    type: Number,
  },
  totalNewPost: {
    type: Number,
  },
  totalNewUser: {
    type: Number,
  },
});

module.exports = Mongoose.model('SystemOperation', SystemOperationSchema);
