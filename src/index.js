const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');
const Save = require('./classes/Save');
const {
  getDataJson,
  isDocExist,
  docNotFoundError,
  throwError,
  writeData,
} = require('./utils/utils');
module.exports = class OnlineDB {
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

  count() {
    const data = getDataJson(this.collectionPath);
    return data.length;
  }

  insertOne(data) {
    const collectionPath = this.collectionPath;
    if (!isDocExist(collectionPath)) docNotFoundError();
    const allDocs = fs.readFileSync(collectionPath);

    if (!data.id) {
      data.id = v4();
    }

    const jsonData = JSON.parse(allDocs);
    jsonData.push(data);
    return new Save(jsonData, this.collectionPath);
  }

  insertMany(dataArr) {
    if (!isDocExist(this.collectionPath)) docNotFoundError();
    if (!(dataArr instanceof Array))
      throw new Error('Method only accept array of items');

    for (let item of dataArr) {
      this.insertOne(item).save();
    }
  }

  // Find all the items related to one document
  find(filter) {
    // check if the doc exist
    if (!isDocExist(this.collectionPath)) docNotFoundError();

    // read the file
    const data = getDataJson(this.collectionPath);

    return data;
  }

  // find one document by id
  // Return null if isn't exist
  findOneById(id) {
    if (!id) throwError('Expected an ID to find the document');
    const documents = getDataJson(this.collectionPath);

    const document = documents.find(item => item.id === id);

    return document;
  }

  //   find one document
  findOne(citeria) {
    if (!(citeria instanceof Object)) throwError('Expected object');
    const documents = getDataJson(this.collectionPath);
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
    if (!id) throwError('Expected id for updating ');
    if (!(fields instanceof Object)) throwError('Expected fileds to be object');

    const documents = getDataJson(this.collectionPath);

    const documentIdx = documents.findIndex(document => document.id === id);
    if (documentIdx === -1) throwError('Document Not Found');

    for (let field in fields) {
      documents[documentIdx][field] = fields[field];
    }

    writeData(documents, this.collectionPath);
    // return documents[documentIdx];
  }

  updateOne(filter, updates) {
    if (!(filter instanceof Object))
      throwError('Expected filter to be an object');
    if (!(updates instanceof Object))
      throwError('Expected updates to be an object');

    const filterKeys = Object.keys(filter);
    const documents = getDataJson(this.collectionPath);

    const documentIdx = documents.findIndex(
      document => document[filterKeys[0]] === filter[filterKeys[0]]
    );

    if (documentIdx === -1) throwError('Document not found');
    documents[documentIdx] = {
      ...documents[documentIdx],
      ...updates,
    };

    writeData(documents, this.collectionPath);
  }
  // Delete one by id
  deleteOneById(id) {
    if (!id) throwError('Expected id');
    if (typeof id != 'string') throwError('id should be type of string');
    let documents = getDataJson(this.collectionPath);

    // check if the document exist
    const idx = documents.findIndex(document => document.id === id);
    if (idx === -1) throwError("Document dont' found ");

    // delete the document
    documents = documents.filter(document => document.id !== id);

    writeData(documents);
  }
  // Delete many documents with given filter
  deleteMany(filter) {
    if (!(filter instanceof Object))
      throwError('Filter should be type of object');
    let documents = getDataJson(this.collectionPath);

    const filterKeys = Object.keys(filter);
    // check if the document exist
    const idx = documents.findIndex(
      document => document[filterKeys[0]] === filter[filterKeys[0]]
    );
    if (idx === -1) throwError("Document dont' found ");

    // delete the document
    documents = documents.filter(
      document => document[filterKeys[0]] !== filter[filterKeys[0]]
    );

    writeData(documents);
  }

  // Delete many documents with given filter
  deleteOne(filter) {
    if (!(filter instanceof Object))
      throwError('Filter should be type of object');
    let documents = getDataJson(this.collectionPath);

    const filterKeys = Object.keys(filter);
    // check if the document exist
    const idx = documents.findIndex(
      document => document[filterKeys[0]] === filter[filterKeys[0]]
    );
    if (idx === -1) throwError("Document dont' found ");
    // Remove the document
    documents.splice(idx, 1);

    writeData(documents);
  }
}
