const fs = require('fs');
const Save = require('./Save');
const limit = require('../helpers/limit');
const { skip } = require('../helpers/skip');
const { v4 } = require('uuid');
const {
  getDataJson,
  isDocExist,
  docNotFoundError,
  throwError,
  writeData,
  checkSeclect,
} = require('../utils/utils');
const { applyFilter } = require('../helpers/applyFilter');
const { selectionInvalidType } = require('../errors/collectionErrors');
const { checkApplyRelation } = require('../relation');
const { applySelection } = require('../helpers');
const { applyUpdates } = require('../helpers/applyUpdates');
module.exports = class Collection {
  constructor(docName, dbName, schema) {
    this.docName = docName;
    this.dbName = dbName;
    this.collectionPath = `./OnlineDB/${this.dbName}/${this.docName}.onlinedb.db`;
    this.schema = schema;
  }

  count() {
    const data = getDataJson(this.collectionPath);
    return data.length;
  }

  insertOne(data) {
    const collectionPath = this.collectionPath;
    if (!isDocExist(collectionPath)) docNotFoundError();
    const collection = getDataJson(collectionPath);

    if (!data.id) {
      data.id = v4();
    }
    // if there is any schema -> run validation
    if (this.schema) {
      this.schema.validateDataAganistSchema(data, this.dbName, this.docName);
    }
    data.createdAt = new Date();
    collection.push(data);
    console.log(data);
    writeData(collection, collectionPath);
    return data;
  }

  insertMany(dataArr) {
    console.log(dataArr, 'here');
    if (!isDocExist(this.collectionPath)) docNotFoundError();
    if (!(dataArr instanceof Array))
      throw new Error(' insertMany only accept array of items');

    for (let item of dataArr) {
      this.insertOne(item);
    }
  }

  // Find all the items related to one document
  find(filter) {
    // check if the doc exist
    if (!isDocExist(this.collectionPath)) docNotFoundError();

    // read the file
    let data = getDataJson(this.collectionPath);

    // apply filters
    data = applyFilter(filter, data);
    if (filter && filter.skip) data = skip(data, filter.skip);

    if (filter && filter.limit) data = limit(filter.limit, data);
    // check for selection
    if (typeof filter.select !== 'undefined') {
      data = applySelection(filter.select, data);
    }

    // populate data
    data = checkApplyRelation(filter, this.dbName, this.schema, data);

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
  findOne(filter) {
    if (!(filter instanceof Object)) throwError('Expected object');
    const collection = getDataJson(this.collectionPath);
    // apply filters
    let data = applyFilter(filter, collection);
    // check for selection
    if (typeof filter.select !== 'undefined') {
      data = applySelection(filter.select, data);
    }

    // populate data
    data = checkApplyRelation(filter, this.dbName, this.schema, data);

    return data[0];
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

    documents[documentIdx].updatedAt = new Date();
    writeData(documents, this.collectionPath);
  }

  updateOne(filter, updates) {
    if (!(filter instanceof Object))
      throwError('Expected filter to be an object');
    if (!(updates instanceof Object))
      throwError('Expected updates to be an object');

    const collection = getDataJson(this.collectionPath);

    // apply filters
    let data = applyFilter(filter, collection);
    if (data.length === 0) throwError('Document not found');

    for (let fieldToUpdate in updates) {
      let filedToUpdateValue = updates[fieldToUpdate];

      let document = data[0];
      document[fieldToUpdate] = filedToUpdateValue;
    }
    data[0].updatedAt = new Date();
    writeData(collection, this.collectionPath);
  }

  updateMany(filter, fieldsToUpdate) {
    if (!(filter instanceof Object))
      throwError('Expected filter to be an object'.bgRed);
    if (!(fieldsToUpdate instanceof Object))
      throwError('Expected fieldsToUpdate to be an object'.bgRed);
    // get all data
    const collection = getDataJson(this.collectionPath);
    // apply filters
    let data = applyFilter(filter, collection);
    // apply your updates
    data = applyUpdates(data, this.schema.schema, fieldsToUpdate);
    // replace the old document by the new ones
    writeData(collection, this.collectionPath);
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

    writeData(documents, this.collectionPath);
  }
  // Delete many documents with given filter
  deleteMany(filter) {
    if (!(filter instanceof Object))
      throwError('Filter should be type of object');
    let collection = getDataJson(this.collectionPath);
    // apply filters
    let data = applyFilter(filter, collection);
    let newCollection = [];

    for (let document of collection) {
      // check if it is in the deleted documents
      const idx = data.findIndex(doc => doc.id == document.id);
      if (idx === -1) continue;
      newCollection.push(document);
    }

    writeData(newCollection, this.collectionPath);
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

    writeData(documents, this.collectionPath);
  }
};
