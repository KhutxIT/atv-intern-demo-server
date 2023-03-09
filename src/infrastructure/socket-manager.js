const socketIO = require('socket.io')
const config = require('config')
const { authorize } = require('socketio-jwt')

const io = new socketIO.Server({
  connectTimeout: 180000
})

io.use(authorize({
  secret: config.tokenSecret,
  handshake: true
}))

function attachServer(server) {
  return io.attach(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true,
      transports: ['websocket', 'polling'],
    },
    upgradeTimeout: 120000,
    allowEIO3: true,
    pingTimeout: 180000,
    maxHttpBufferSize: 1e8
  })
}

module.exports = {
  attachServer,
  io
}
