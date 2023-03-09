const Mongoose = require('mongoose')
const { Schema } = Mongoose

const chatSchema = new Schema(
  {
    participants: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User'
        },
        seenTime: {
          type: Date,
        },
        unreadCount: {
          type: Number,
          default: 0
        },
        isTyping: {
          type: Boolean,
          default: false
        }
      }
    ],
    title: {
      type: String,
    },
    avatar: {
      type: String
    },
    chatContent: {
      type: String,
    },
    lastMessage: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    isGroupChat: {
      type: Boolean,
      default: false
    },
  },
  { 
    timestamps: true,
    versionKey: false
  }
)

module.exports = Mongoose.model("Chat", chatSchema)
