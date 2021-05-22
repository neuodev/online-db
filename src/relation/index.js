const fs = require('fs');
const colors = require('colors');
const { getDataJson, throwError } = require('../utils/utils');
const { getRelatedCollection } = require('../utils/utils');
const { applySelectionRelation } = require('../helpers');
const { invalidPopulateQuery } = require('../errors/relationErrors');
module.exports.checkApplyRelation = (
  filter,
  dbName,
  schema,
  firstCollection
) => {
  if (!filter.populate) return firstCollection;
  invalidPopulateQuery(filter.populate);
  let populatedField =
    filter.populate instanceof Object ? filter.populate.field : filter.populate;

  let schemaField = schema.schema[populatedField];

  if (!(schemaField instanceof Array)) {
    let field;
    if (typeof filter.populate === 'string') {
      field = filter.populate;
    } else {
      field = filter.populate.field;
    }
    //   get populated data
    let data = oneToOneRelation(field, dbName, schema, firstCollection);
    // return if there is any selection
    if (typeof filter.populate === 'string' || !filter.populate.select)
      return data;
    return applySelectionRelation(
      filter.populate.select,
      data,
      filter.populate.field
    );
  } else if (schemaField instanceof Array) {
    const field =
      typeof filter.populate === 'string'
        ? filter.populate
        : filter.populate.field;
    return oneToManyRelation(field, dbName, schema, firstCollection);
  } else if (filter.populate instanceof Object) {
  }
};

function oneToOneRelation(field, dbName, schema, firstCollection) {
  if (!schema.schema[field]) {
    throwError(`Schema don't have any ref for "${field}"`.bgRed);
  }

  let secondCollectionPath = `./${dbName}/${schema.schema[field].ref}.json`;
  if (!fs.existsSync(secondCollectionPath))
    throwError(`"${field}" collection doesn't exist `.bgRed);
  // read the second collection
  const secondCollection = getDataJson(secondCollectionPath);

  let finalData = [];

  for (let document of firstCollection) {
    document[field] = secondCollection.find(item => item.id == document[field]);

    finalData.push(document);
  }
  return finalData;
}

function oneToManyRelation(field, dbName, schema, firstCollection) {
  // check if it's exist and get the second collection
  let secondCollectionName = schema.schema[field][0].ref;

  const secondCollection = getRelatedCollection(dbName, secondCollectionName);
  for (let firstDocument of firstCollection) {
    let fieldToPopulate = firstDocument[field];
    let populateFieldValue = [];
    for (let item of fieldToPopulate) {
      let secondDocument = secondCollection.find(doc => doc.id === item);

      populateFieldValue.push(secondDocument);
    }

    firstDocument[field] = populateFieldValue;
  }
  return firstCollection;
}
