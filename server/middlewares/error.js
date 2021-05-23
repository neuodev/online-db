const colors = require('colors');

const errorHandler = (err, req, res, next) => {
  console.log(error.message.bgRed);
  res.status(err.statusCode || 500).json({
    error: err.message,
  });
};
module.exports = errorHandler;
