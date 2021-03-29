const { StatusCodes } = require('http-status-codes');

const deleteBlocker = (req, res, next) => {
  if (req.method === 'DELETE') {
    res.sendStatus(StatusCodes.METHOD_NOT_ALLOWED);
  } else {
    next();
  }
};

module.exports = deleteBlocker;
