const express = require('express');
const { getDatabases, createDatabase, deleteDatabase } = require('../controllers/database');
const databaseRouter = express.Router();

databaseRouter.route('/database').get(getDatabases);
databaseRouter.route('/database/:dbName').post(createDatabase).delete(deleteDatabase);
module.exports = databaseRouter;
