const express = require('express');
const { getDatabases, createDatabase } = require('../controllers/database');
const databaseRouter = express.Router();

databaseRouter.route('/database').get(getDatabases);
databaseRouter.route('/database/:dbName').post(createDatabase);
module.exports = databaseRouter;
