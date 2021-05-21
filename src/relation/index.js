const fs = require('fs');
const colors = require('colors');
const { getDataJson, throwError } = require('../utils/utils');
module.exports.checkApplyRelation = (
  filter,
  dbName,
  schema,
  firstCollection
) => {
  if (filter.populate) {
    if (typeof filter.populate === 'string') {
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
    if (filter.populate instanceof Object) {
    }
  }
};
