const StatusCodes = require('http-status-codes');

const exists = (object) => {
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

const dateValidator = (req, res, next) => {
  const params = req.query;
  const { headers } = req;
  const qsDateKey = exists(params);
  const hDateKey = exists(headers);
  const qsEpochTime = getDate(params[qsDateKey]);
  const hEpochTime = getDate(headers[hDateKey]);

  if (!qsDateKey && !hDateKey) {
    res.status(StatusCodes.UNAUTHORIZED).send('Neither query string parameters nor headers supplied a date');
  } else if (qsDateKey && hDateKey) {
    if (isValidDate(qsEpochTime) && isValidDate(hEpochTime)) {
      if (qsEpochTime.getTime() !== hEpochTime.getTime()) {
        res.status(StatusCodes.UNAUTHORIZED).send('Dates in query string parameters and headers are different!');
      }
    } else {
      res.status(StatusCodes.BAD_REQUEST).send('Date in query string parameters and/or date in headers is invalid!');
    }
  } else {
    res.sendStatus(StatusCodes.OK);
  }
  next();
};

module.exports = dateValidator;
