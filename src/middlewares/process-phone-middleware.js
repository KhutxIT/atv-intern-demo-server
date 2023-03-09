const { formatPhone } = require('../utils/phone-util');

const ProcessPhoneMiddleware = (req, res, next) => {
  const data = req.body;

  if (data && data.phone) {
    req.body = {
      ...data,
      phone: formatPhone(data.phone),
    };
  }

  next();
};

module.exports = ProcessPhoneMiddleware;
