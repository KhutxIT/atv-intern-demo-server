process.env.NODE_CONFIG_DIR = './src/config';
const fs = require('fs');
const config = require('config');
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
var http = require('http');
const { InvalidRequestException } = require('./src/exceptions');
const {
  ResponseHandleMiddleware,
  ErrorHandleMiddleware,
  ErrorLogsMiddleware,
} = require('./src/middlewares');

//#region IMPORT ROUTER
const routes_v1 = require('./src/routes/v1');
const routes_v2 = require('./src/routes/v2');
const { connectDB } = require('./src/infrastructure/db-manager');
const { attachServer } = require('./src/infrastructure/socket-manager');
//#endregion

const app = express();
var server = http.createServer(app);

//logger
app.use(logger('dev'));

// Create logs folder if not exist

//#region SET UP MIDDLEWARE
app.use(cors());
app.options('*', cors());
app.use(express.json({ limit: '1000kb' }));
app.use(express.urlencoded({ limit: '1000kb', extended: true }));
//#endregion

app.use(express.static('public'));

// Connect to DB
connectDB();

//#region SET UP ROUTER
app.use('/api/v1', routes_v1);
app.use('/api/v2', routes_v2);

const chatRouter = require('./src/routes/v1/chat-router');
app.use('/api/chat', chatRouter);
//#endregion

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new InvalidRequestException());
});

app.use([ResponseHandleMiddleware, ErrorLogsMiddleware, ErrorHandleMiddleware]);

const port = config.port || process.env.PORT || 5000;
server.listen(port, () => console.log(`Server running on port: ${port}`));

require('./src/sockets')(attachServer(server));
require('./src/infrastructure/app-manager')(app);
