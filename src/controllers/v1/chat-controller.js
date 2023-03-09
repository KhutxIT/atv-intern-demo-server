const mongoose = require('mongoose');
const { sendMessage, sendReadMessage } = require('../../sockets/message-socket');
const ChatRoom = mongoose.model('ChatRoom');
const Message = mongoose.model('Message');
const User = mongoose.model('User');

exports.createImageMessage = (req, res, next) => {
  new Message({
    roomId: req.body.roomId,
    sender: req.user._id,
    receiver: JSON.parse(req.body.receiver)._id,
    photo: req.body.photo,
    messageType: 'image',
  })
    .save()
    .then((result) => {
      ChatRoom.findByIdAndUpdate(
        { _id: req.body.roomId },
        { $inc: { messages: 1 } }
      )
        .then((result) => console.log(result))
        .catch((err) => {
          console.log(err.message);
        });
      messageHandler.sendImageMessage(req, {
        message: { ...result.toObject(), uuid: req.body.uuid },
        receiver: JSON.parse(req.body.receiver),
      });
      res
        .status(200)
        .json({ message: { ...result.toObject(), uuid: req.body.uuid } });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.getChatRooms = (req, res) => {
  ChatRoom.getRooms(mongoose.Types.ObjectId(req.user._id))
    .then((rooms) => {
      res.status(200).json({ rooms });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.getMessagesForRoom = (req, res) => {
  let query = null;
  if (req.body.initialFetch) {
    query = { roomId: req.body._id };
  } else {
    query = {
      $and: [
        {
          _id: {
            $lt: req.body.lastId,
          },
          roomId: req.body._id,
        },
      ],
    };
  }
  Message.find(query)
    .limit(50)
    .sort({ createdAt: -1 })
    .then((result) => {
      res.status(200).json({ messages: result });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.sendMessage = (req, res, next) => {
  new Message({
    roomId: req.body.roomId,
    sender: req.user._id,
    text: req.body.value,
    receiver: req.body.receiver._id,
    messageType: 'text',
  })
    .save()
    .then((result) => {
      ChatRoom.findByIdAndUpdate(
        { _id: req.body.roomId },
        { $inc: { messages: 1 } }
      )
        .then((result) => console.log(result))
        .catch((err) => {
          console.log(err.message);
        });
      sendMessage({
        message: { ...result.toObject() },
        receiver: req.body.receiver,
      });
      res
        .status(200)
        .json({ message: { ...result.toObject(), uuid: req.body.uuid } });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.readMessages = (req, res, next) => {
  const receiverId = req.room.members.filter(
    (member) => member.toString().trim() !== req.user._id.toString().trim()
  );
  Message.updateMany(
    {
      _id: { $in: req.body.messageIds },
      receiver: mongoose.Types.ObjectId(req.user._id),
    },
    { $set: { read: true } },
    { multi: true }
  )
    .then(() => {
      sendReadMessage({
        messageIds: req.body.messageIds,
        receiver: receiverId[0],
        roomId: req.room._id,
      });
      res.status(200).json({ read: 'messages' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: err.message });
    });
};

exports.checkRoom = (req, res, next) => {
  ChatRoom.find({
    members: { $in: mongoose.Types.ObjectId(req.user._id) },
    _id: mongoose.Types.ObjectId(req.body.roomId),
  })
    .then((rooms) => {
      if (rooms.length) {
        req.room = rooms[0];
        next();
      } else {
        return res.status(500).json({
          message: 'Invalid room',
        });
      }
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ message: err.message });
    });
};
