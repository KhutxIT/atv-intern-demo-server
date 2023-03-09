const Mongoose = require('mongoose')
const { Schema } = Mongoose

const chatParticipantSchema = new Schema(
  {
    participant: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    seenTime: {
      type: Date,
    },
    unreadCount: {
      type: Number,
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = Mongoose.model("ChatParticipant", chatParticipantSchema)
