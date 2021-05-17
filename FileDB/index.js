const fs = require('fs');
const path = require('path');

module.exports = class FileDB {
  constructor(dbName) {
    this.dbName = dbName;
    this._init();
  }

  _init() {
    if (!this.dbName) throw new Error('DB name is required');
    if (!fs.existsSync(`./${this.dbName}`)) fs.mkdirSync(`./${this.dbName}`);
  }

  createDocument(docName) {
    if (!docName) throw new Error('Document name is required');
    const docFile = `./${this.dbName}/${docName}.json`;

    if (!fs.existsSync(docFile)) fs.writeFileSync(docFile, JSON.stringify([]));

    return new Document(docName, this.dbName);
  }

};

class Document {
  constructor(docName, dbName) {
    this.docName = docName;
    this.dbName = dbName;
    this.docPath = `./${this.dbName}/${this.docName}.json`;
  }

  insertOne(data) {
    const docPath = this.docPath;
    if (!this._isDocExist(docPath)) this._docNotFoundError();
    const allDocs = fs.readFileSync(docPath);
    const jsonData = JSON.parse(allDocs);
    jsonData.push(data);
    fs.writeFileSync(docPath, JSON.stringify(jsonData));
  }


  insertMany(dataArr) {
    if (!this._isDocExist(this.docPath)) thsi._docNotFoundError();
    if (!(dataArr instanceof Array))
      throw new Error('Method only accept array of items');

    for (let item of dataArr) {
      this.insertOne(item);
    }
  }

  
  find() {
    // check if the doc exist
    if (!this._isDocExist()) this._docNotFoundError();

    // read the file
    const data = this._getDataJson();

    return data;
  }

  // Utils
  _isDocExist() {
    return fs.existsSync(this.docPath);
  }

  _docNotFoundError() {
    throw new Error("Document doesn't exist");
  }

  _getDataJson() {
    const allDocs = fs.readFileSync(this.docPath);
    return JSON.parse(allDocs);
  }
}
