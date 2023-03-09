const Mongoose = require('mongoose')

const mediaSchema = new Mongoose.Schema(
  {
    mediaType: {
      type: String,
      enum: ['image', 'video', 'file'],
    },
    mimeType: {
      type: String
    },
    src: {
      type: String,
    },
    title: {
      type: String,
    }
  },
  { 
    timestamps: true,
    versionKey: false
  }
)

module.exports = Mongoose.model('Media', mediaSchema)
