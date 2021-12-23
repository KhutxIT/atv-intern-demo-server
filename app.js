const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const db = require('./src/models');
const routes = require('./src/routes');
const { logErrors, clientErrorHandler, errorHandler } = require('./src/middlewares/error');
const ApiError = require('./src/utils/ApiError');

const app = express();
const corsOptions = {
  origin: 'http://localhost:8081'
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));


// db sync
// db.sync({ alter: true }).then(() => {
//   console.log(`Connect to ${db.getDialect()}`);
// });

// api routes
app.use('/api',
  routes,
  (req, res) => {
    res.status(200).send({ message: 'Hello World!' });
  }
);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(404, 'Not Found!'));
});

// error handler:
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

module.exports = app;
