const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
  ],
});

const winstonLogger = (req, res, next) => {
  logger.info({
    currentServerTime: Date.now() / 1000,
    httpVerb: req.method,
    url: req.url,
    body: req.body,
    queryParams: req.query,
    headers: req.headers,
    dateValidation: req.dateValidation.getTime() / 1000,
  });
  next();
};

module.exports = winstonLogger;
