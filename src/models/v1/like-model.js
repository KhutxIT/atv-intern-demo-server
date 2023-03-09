const Mongoose = require('mongoose')

const likeSchema = new Mongoose.Schema(
  {
    userLiked: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    postLiked: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      require: false
    },
    commentLiked: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      require: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = Mongoose.model('Like', likeSchema)
