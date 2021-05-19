const { checkArrayType } = require('../types/types');
const { throwError } = require('../utils/utils');
const {
  checkForPremitiveValues,
  checkForObjectType,
  checkForCriteriaObject,
} = require('../types/typesUtils');
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
      } else if (checkForObjectType(schemaFieldValue)) {
        // there this thow coditions one -> item of object
        for (let subSchemaField in schemaFieldValue) {
          if (
            checkForPremitiveValues(
              schemaFieldValue[subSchemaField],
              dataFieldValue[subSchemaField]
            )
          ) {
            throwError(
              ` Field "${subSchemaField} in ${schemaField} object" expected type of ${typeof schemaFieldValue[
                subSchemaField
              ]()} but get type of ${typeof dataFieldValue[subSchemaField]} `
            );
          }
        }
      } else if (checkForCriteriaObject(schemaFieldValue)) {
        if (checkForPremitiveValues(schemaFieldValue.type, dataFieldValue)) {
          throwError(
            ` Field "${schemaField}" expected type of ${typeof schemaFieldValue.type()} but get type of ${typeof dataFieldValue} `
          );
        }
      } else if (checkForPremitiveValues(schemaFieldValue, dataFieldValue)) {
        throwError(
          ` Field "${schemaField}" expected type of ${typeof schemaFieldValue()} but get type of ${typeof dataFieldValue} `
        );
      }
    }
  }
};
