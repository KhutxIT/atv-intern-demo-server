const Mongoose = require('mongoose')

const commentSchema = new Mongoose.Schema(
  {
    postComment: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    userComment: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      require: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = Mongoose.model('Comment', commentSchema)
