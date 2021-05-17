const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');
module.exports = class DocDB {
  constructor(dbName) {
    this.dbName = dbName;
    this._init();
  }

  _init() {
    if (!this.dbName) throw new Error('DB name is required');
    if (!fs.existsSync(`./${this.dbName}`)) fs.mkdirSync(`./${this.dbName}`);
  }

  createCollection(docName) {
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
    this.collectionPath = `./${this.dbName}/${this.docName}.json`;
  }

  insertOne(data) {
    const collectionPath = this.collectionPath;
    if (!this._isDocExist(collectionPath)) this._docNotFoundError();
    const allDocs = fs.readFileSync(collectionPath);

    if (!data.id) {
      data.id = v4();
    }

    const jsonData = JSON.parse(allDocs);
    jsonData.push(data);
    fs.writeFileSync(collectionPath, JSON.stringify(jsonData));
  }

  insertMany(dataArr) {
    if (!this._isDocExist(this.collectionPath)) thsi._docNotFoundError();
    if (!(dataArr instanceof Array))
      throw new Error('Method only accept array of items');

    for (let item of dataArr) {
      this.insertOne(item);
    }
  }

  // Find all the items related to one document
  find() {
    // check if the doc exist
    if (!this._isDocExist()) this._docNotFoundError();

    // read the file
    const data = this._getDataJson();

    return data;
  }

  // find one document by id
  // Return null if isn't exist
  findOneById(id) {
    if (!id) throw new Error('Expected an ID to find the document');
    const documents = this._getDataJson();

    const document = documents.find(item => item.id === id);

    return document;
  }

  //   find one document
  findOne(citeria) {
    if (!(citeria instanceof Object)) throw new Error('Expected object');
    const documents = this._getDataJson();
    const keys = Object.keys(citeria);
    // @todo add an utild to do this for all citerias
    const document = documents.find(
      document => document[keys[0]] === citeria[keys[0]]
    );

    return document;
  }
  // Find one document and update it
  // @return the updated document
  updateOneById(id, fields) {
    if (!id) this._throwError('Expected id for updating ');
    if (!(fields instanceof Object))
      this._throwError('Expected fileds to be object');

    const documents = this._getDataJson();

    const documentIdx = documents.findIndex(document => document.id === id);
    if (documentIdx === -1) this._throwError('Document Not Found');

    for (let field in fields) {
      documents[documentIdx][field] = fields[field];
    }

    this._writeData(documents);
    // return documents[documentIdx];
  }

  updateOne(filter, updates) {
    if (!(filter instanceof Object))
      this._throwError('Expected filter to be an object');
    if (!(updates instanceof Object))
      this._throwError('Expected updates to be an object');

    const filterKeys = Object.keys(filter);
    const documents = this._getDataJson();

    const documentIdx = documents.findIndex(
      document => document[filterKeys[0]] === filter[filterKeys[0]]
    );

    if (documentIdx === -1) this._throwError('Document not found');
    documents[documentIdx] = {
      ...documents[documentIdx],
      ...updates,
    };

    this._writeData(documents);
  }
  // Delete one by id
  deleteOneById(id) {
    if (!id) this._throwError('Expected id');
    if (typeof id != 'string') this._throwError('id should be type of string');
    let documents = this._getDataJson();

    // check if the document exist
    const idx = documents.findIndex(document => document.id === id);
    if (idx === -1) this._throwError("Document dont' found ");

    // delete the document
    documents = documents.filter(document => document.id !== id);

    this._writeData(documents);
  }
  // Delete many documents with given filter
  deleteMany(filter) {
    if (!(filter instanceof Object))
      this._throwError('Filter should be type of object');
    let documents = this._getDataJson();

    const filterKeys = Object.keys(filter);
    // check if the document exist
    const idx = documents.findIndex(
      document => document[filterKeys[0]] === filter[filterKeys[0]]
    );
    if (idx === -1) this._throwError("Document dont' found ");

    // delete the document
    documents = documents.filter(
      document => document[filterKeys[0]] !== filter[filterKeys[0]]
    );

    this._writeData(documents);
  }

  // Delete many documents with given filter
  deleteOne(filter) {
    if (!(filter instanceof Object))
      this._throwError('Filter should be type of object');
    let documents = this._getDataJson();

    const filterKeys = Object.keys(filter);
    // check if the document exist
    const idx = documents.findIndex(
      document => document[filterKeys[0]] === filter[filterKeys[0]]
    );
    if (idx === -1) this._throwError("Document dont' found ");
    // Remove the document
    documents.splice(idx, 1);

    this._writeData(documents);
  }
  // Utils
  _isDocExist() {
    return fs.existsSync(this.collectionPath);
  }

  _docNotFoundError() {
    throw new Error("Document doesn't exist");
  }

  _throwError(message) {
    throw new Error(message);
  }

  _getDataJson() {
    const allDocs = fs.readFileSync(this.collectionPath);
    return JSON.parse(allDocs);
  }

  _writeData(data) {
    if (!data) this._throwError("Data isn't exist ");
    fs.writeFileSync(this.collectionPath, JSON.stringify(data));
  }
}
