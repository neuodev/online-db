const OnlineDB = require('./src');
const Schema = require('./src/schema');
const { startServer } = require('./server');
module.exports = {
  OnlineDB,
  Schema,
  startServer,
};
