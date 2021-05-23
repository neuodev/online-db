const express = require('express');
const { getDatabases } = require('../controllers/database');
const databaseRouter = express.Router()

databaseRouter.route('/database').get(getDatabases)

module.exports = databaseRouter