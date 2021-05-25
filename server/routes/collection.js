const express = require('express');
const { getDocumentDtails, deleteCollection } = require('../controllers/collection');
const collectionRouter = express.Router();

collectionRouter
  .route('/collection/:database/:collection')
  .get(getDocumentDtails).delete(deleteCollection);

module.exports = collectionRouter;
