const Mongoose = require('mongoose');

const feedbackSchema = new Mongoose.Schema(
  {
    userSent: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      require: true,
    },
    content: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = Mongoose.model('Feedback', feedbackSchema);
