const Mongoose = require('mongoose')

const messageSchema = new Mongoose.Schema(
  {
    user: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    chat: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      required: true
    },
    status: {
      type: String,
      enum: ['SENT', 'RECEIVED', 'SEEN', 'FAILED'],
      required: true
    },
    medias: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Media'
      }
    ],
    text: {
      type: String,
      default: '',
      trim: true
    },
    isSpecial: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true,
    versionKey: false
  }
)

module.exports = Mongoose.model('Message', messageSchema)
