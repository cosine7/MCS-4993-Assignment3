const { StatusCodes } = require('http-status-codes');

const getDateKey = (object) => {
  let result = null;
  Object.keys(object).forEach((key) => {
    if (key.toLowerCase() === 'date-validation') {
      result = key;
    }
  });
  return result;
};

const isValidDate = (date) => date instanceof Date && !Number.isNaN(date.getTime());

const getDate = (date) => new Date(Number.parseInt(date, 10) * 1000);

const withinRange = (time, serverTime) => time.getTime() >= serverTime.getTime() - 300000
      && time.getTime() <= serverTime.getTime() + 300000;

const dateValidator = (req, res, next) => {
  const params = req.query;
  const { headers } = req;
  const queryStringDateKey = getDateKey(params);
  const headerDateKey = getDateKey(headers);
  const queryStringEpochTime = getDate(params[queryStringDateKey]);
  const headerEpochTime = getDate(headers[headerDateKey]);
  const currentServerTime = new Date(Date.now());

  const checkDate = (date) => {
    if (isValidDate(date)) {
      if (withinRange(date, currentServerTime)) {
        req.dateValidation = date;
        next();
      } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send('Invalid epoch date!');
    }
  };

  if (queryStringDateKey && headerDateKey) {
    if (isValidDate(queryStringEpochTime) && isValidDate(headerEpochTime)) {
      if (queryStringEpochTime.getTime() === headerEpochTime.getTime()
          && withinRange(queryStringEpochTime, currentServerTime)) {
        req.dateValidation = queryStringEpochTime;
        next();
      } else {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send('Invalid epoch dates!');
    }
  } else if (queryStringDateKey) {
    checkDate(queryStringEpochTime);
  } else if (headerDateKey) {
    checkDate(headerEpochTime);
  } else {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
  }
};

module.exports = dateValidator;
