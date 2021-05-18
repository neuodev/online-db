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
        // only the type filed should have one item in the array
        if (schemaFieldValue.length > 1)
          throwError(
            `Invalid schema at ${schemaField}. you have more than one item in the array`
          );
        // check if it has single value or an object
        if (schemaFieldValue[0].type) {
          checkArrayOfType(dataFieldValue, schemaFieldValue, schemaField);
        } else {
          let subSchema = schemaFieldValue[0];
          for (let subDataItem of dataFieldValue) {
            for (let subSchemaField in subSchema) {
              if (
                checkForPremitiveValues(
                  subSchema[subSchemaField],
                  subDataItem[subSchemaField]
                )
              ) {
                throwError(
                  ` Field ${ subSchemaField} expected type of ${typeof subSchema[subSchemaField]()} but get type of ${typeof subDataItem[subSchemaField]} `
                );
              }
            }
          }
        }
      } else if (checkForPremitiveValues(schemaFieldValue, dataFieldValue)) {
        throwError(
          ` Field ${typeof schemaFieldValue()} expected type of ${typeof schemaFieldValue()} but get type of ${typeof dataFieldValue} `
        );
      }
    }
  }
};
