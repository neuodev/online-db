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

module.exports = {
  isDocExist,
  docNotFoundError,
  throwError,
  getDataJson,
  writeData,
  initDB,
};
