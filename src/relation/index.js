const fs = require('fs');
const colors = require('colors');
const { getDataJson, throwError } = require('../utils/utils');
const { getRelatedCollection } = require('../utils/utils');
module.exports.checkApplyRelation = (
  filter,
  dbName,
  schema,
  firstCollection
) => {
  if (filter.populate) {
    let schemaField = schema.schema[filter.populate];
    if (
      typeof filter.populate === 'string' &&
      !(schemaField instanceof Array)
    ) {
      return oneToOneRelation(filter, dbName, schema, firstCollection);
    } else if (
      typeof filter.populate === 'string' &&
      schemaField instanceof Array
    ) {
      return oneToManyRelation(filter, dbName, schema, firstCollection);
    } else if (filter.populate instanceof Object) {
    }
  }
};

function oneToOneRelation(filter, dbName, schema, firstCollection) {
  if (!schema.schema[filter.populate]) {
    throwError(`Schema don't have any ref for "${filter.populate}"`.bgRed);
  }

  let secondCollectionPath = `./${dbName}/${
    schema.schema[filter.populate].ref
  }.json`;
  if (!fs.existsSync(secondCollectionPath))
    throwError(`"${filter.populate}" collection doesn't exist `.bgRed);
  // read the second collection
  const secondCollection = getDataJson(secondCollectionPath);

  let finalData = [];

  for (let document of firstCollection) {
    document[filter.populate] = secondCollection.find(
      item => item.id == document[filter.populate]
    );

    finalData.push(document);
  }
  return finalData;
}

function oneToManyRelation(filter, dbName, schema, firstCollection) {
  // check if it's exist and get the second collection
  let secondCollectionName = schema.schema[filter.populate][0].ref;

  const secondCollection = getRelatedCollection(dbName, secondCollectionName);
  for (let firstDocument of firstCollection) {
    let fieldToPopulate = firstDocument[filter.populate];
    let populateFieldValue = [];
    for (let item of fieldToPopulate) {
      let secondDocument = secondCollection.find(doc => doc.id === item);

      populateFieldValue.push(secondDocument);
    }

    firstDocument[filter.populate] = populateFieldValue;
  }
  return firstCollection;
}
