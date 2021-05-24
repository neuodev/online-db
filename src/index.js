const fs = require('fs');
const Collection = require('./classes/Collection');
const {
  initDB,
  printCollections,
  printDB,
  dropDB,
  removeCollection,
  clearDB,
} = require('./utils/utils');
module.exports = class OnlineDB {
  constructor(dbName) {
    this.dbName = dbName.toLowerCase();
    initDB(dbName);
  }

  createCollection(colName, schema) {
    if (!colName) throw new Error('Document name is required');
    const validCollectionName = colName.toLowerCase();
    const docFile = `./OnlineDB/${this.dbName}/${validCollectionName}.onlinedb.db`;

    if (!fs.existsSync(docFile)) fs.writeFileSync(docFile, JSON.stringify([]));

    return new Collection(validCollectionName, this.dbName, schema);
  }
};

if (process.argv[2] === 'showdb') {
  printDB();
}

if (process.argv[2] === 'showCol') {
  printCollections();
}

if (process.argv[2] === 'drop') {
  dropDB();
}

if (process.argv[2] === 'remove') {
  removeCollection();
}

if (process.argv[2] == 'clear') {
  clearDB();
}
