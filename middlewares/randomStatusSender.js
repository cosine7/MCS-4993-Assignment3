const { StatusCodes } = require('http-status-codes');

const randomStatusSender = (req, res, next) => {
  const number = Math.floor(Math.random() * 2);
  if (number) {
    res.status(StatusCodes.OK).send('Hello World');
    next();
  } else {
    throw new Error('Oops');
  }
};

module.exports = randomStatusSender;
