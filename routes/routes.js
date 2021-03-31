const express = require('express');

const router = express.Router();

router.all('/', (req, res, next) => {
  next();
});

module.exports = router;
