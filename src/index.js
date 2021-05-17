const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');
const Collection = require('./classes/Collection');
const { initDB } = require('./utils/utils');
module.exports = class OnlineDB {
  constructor(dbName) {
    this.dbName = dbName;
    initDB(dbName);
  }

  _init() {
    if (!this.dbName) throw new Error('DB name is required');
    if (!fs.existsSync(`./${this.dbName}`)) fs.mkdirSync(`./${this.dbName}`);
  }

  createCollection(docName) {
    if (!docName) throw new Error('Document name is required');
    const docFile = `./${this.dbName}/${docName}.json`;

    if (!fs.existsSync(docFile)) fs.writeFileSync(docFile, JSON.stringify([]));

    return new Collection(docName, this.dbName);
  }
};
