const Mongoose = require('mongoose')

const appNotificationSchema = new Mongoose.Schema(
  {
    title: {
      type: String,
      require: true
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

module.exports = Mongoose.model('AppNotification', appNotificationSchema)
