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
  const qsDateKey = getDateKey(params);
  const hDateKey = getDateKey(headers);
  const qsEpochTime = getDate(params[qsDateKey]);
  const hEpochTime = getDate(headers[hDateKey]);
  const currentServerTime = new Date(Date.now());

  if (!qsDateKey && !hDateKey) {
    res.status(StatusCodes.UNAUTHORIZED).send('Neither query string parameters nor headers supplied a date');
  } else if (qsDateKey && hDateKey) {
    if (isValidDate(qsEpochTime) && isValidDate(hEpochTime)) {
      if (qsEpochTime.getTime() !== hEpochTime.getTime()) {
        res.status(StatusCodes.UNAUTHORIZED).send('Dates in query string parameters and headers are different!');
      } else if (withinRange(qsEpochTime, currentServerTime)) {
        req.dateValidation = qsEpochTime;
        next();
      } else {
        res.status(StatusCodes.UNAUTHORIZED).send('Both date out of range');
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send('Invalid dates in query string parameters and headers!');
    }
  } else if (qsDateKey) {
    if (isValidDate(qsEpochTime)) {
      if (withinRange(qsEpochTime, currentServerTime)) {
        req.dateValidation = qsEpochTime;
        next();
      } else {
        res.status(StatusCodes.UNAUTHORIZED).send('Query string date out of range');
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send('Invalid epoch date in query string parameters!');
    }
  } else if (hDateKey) {
    if (isValidDate(hEpochTime)) {
      if (withinRange(hEpochTime, currentServerTime)) {
        req.dateValidation = hEpochTime;
        next();
      } else {
        res.status(StatusCodes.UNAUTHORIZED).send('Header date out of range');
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send('Invalid epoch date in query string parameters!');
    }
  }
};

module.exports = dateValidator;
