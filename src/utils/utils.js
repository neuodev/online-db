const fs = require('fs');

function initDB(dbName) {
  if (!dbName) throw new Error('DB name is required');
  if (!fs.existsSync(`./${dbName}`)) fs.mkdirSync(`./${dbName}`);
}
function isDocExist(collectionPath) {
  return fs.existsSync(collectionPath);
}

function docNotFoundError() {
  throw new Error("Document doesn't exist");
}

function throwError(message) {
  throw new Error(message);
}

function getDataJson(collectionPath) {
  const allDocs = fs.readFileSync(collectionPath);
  return JSON.parse(allDocs);
}

function writeData(data, collectionPath) {
  if (!data) this._throwError("Data isn't exist ");
  fs.writeFileSync(collectionPath, JSON.stringify(data));
}

// ['age']
function checkSeclect(selectArray) {
  let isSelect = !selectArray[0].startsWith('-') ? true : false;
  let currentState = isSelect;

  for (let field of selectArray) {
    if (
      (isSelect && field.startsWith('-')) ||
      (!isSelect && !field.startsWith('-'))
    )
      throwError('"Select" can only select on remove value  '.red);
  }
}

function getRelatedCollection(dbName, collectionName) {
  const PATH = `./${dbName}/${collectionName}`;

  if (!fs.existsSync(PATH)) {
    throwError(` "${collectionName}" Doesn't exist on your database `.bgRed);
  }

  return getDataJson(PATH);
}

module.exports = {
  isDocExist,
  docNotFoundError,
  throwError,
  getDataJson,
  writeData,
  initDB,
  checkSeclect,
  getRelatedCollection,
};
