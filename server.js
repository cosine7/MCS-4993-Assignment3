const express = require('express');
const BodyParser = require('body-parser');
const deleteBlocker = require('./middlewares/deleteBlocker');
const dateValidator = require('./middlewares/dateValidator');
const winstonLogger = require('./middlewares/winstonLogger');

const app = express();

app.use(BodyParser.json());
app.use('/', deleteBlocker);
app.use('/', dateValidator);
app.use('/', winstonLogger);
app.listen(8080);
