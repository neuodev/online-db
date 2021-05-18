const { checkArrayOfType } = require('../types/types');
const { throwError } = require('../utils/utils');
const { checkForPremitiveValues } = require('../types/typesUtils');
module.exports = class Schema {
  constructor(schemaFields) {
    this.schema = schemaFields;
  }

  validateDataAganistSchema(data) {
    for (let schemaField in this.schema) {
      const schemaFieldValue = this.schema[schemaField];
      const dataFieldValue = data[schemaField];

      if (schemaFieldValue instanceof Array) {
        // check if the data field is an array
        if (!(dataFieldValue instanceof Array))
          throwError(
            `Exprected filed ${schemaField} to be of type Array but get type ${typeof dataFieldValue}`
          );
        // check if it has single value or an object
        if (schemaFieldValue[0].type) {
          checkArrayOfType(dataFieldValue, schemaFieldValue, schemaField);
        }
      } else if (checkForPremitiveValues(schemaFieldValue, dataFieldValue)) {
        throwError(
          ` Field ${typeof schemaFieldValue()} expected type of ${typeof schemaFieldValue()} but get type of ${typeof dataFieldValue} `
        );
      }
    }
  }
};
