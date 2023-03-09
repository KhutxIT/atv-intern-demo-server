const Mongoose = require('mongoose')

const postSchema = new Mongoose.Schema(
  {
    user: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
    },
    content: {
      type: String
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

postSchema.index({ location: "2dsphere" });

module.exports = Mongoose.model('Post', postSchema)
