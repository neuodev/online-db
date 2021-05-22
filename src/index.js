const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');
const Collection = require('./classes/Collection');
const { initDB } = require('./utils/utils');
module.exports = class OnlineDB {
  constructor(dbName) {
    this.dbName = dbName.toLowerCase();
    initDB(dbName);
  }

  createCollection(colName, schema) {
    if (!colName) throw new Error('Document name is required');
    const validCollectionName = colName.toLowerCase()
    const docFile = `./OnlineDB/${this.dbName}/${validCollectionName}.json`;

    if (!fs.existsSync(docFile)) fs.writeFileSync(docFile, JSON.stringify([]));

    return new Collection(validCollectionName, this.dbName, schema);
  }
};
