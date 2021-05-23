const express = require('express');
const { getDocumentDtails } = require('../controllers/collection');
const collectionRouter = express.Router();

collectionRouter
  .route('/collection/:database/:collection')
  .get(getDocumentDtails);

module.exports = collectionRouter;
