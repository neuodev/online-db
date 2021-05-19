const { checkArrayOfType, checkArrayType } = require('../types/types');
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
        checkArrayType(dataFieldValue, schemaField, schemaFieldValue);
      } else if (checkForPremitiveValues(schemaFieldValue, dataFieldValue)) {
        throwError(
          ` Field "${schemaField}" expected type of ${typeof schemaFieldValue()} but get type of ${typeof dataFieldValue} `
        );
      }
    }
  }
};
