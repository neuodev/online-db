const { checkArrayType } = require('../types/types');
const { throwError } = require('../utils/utils');
const {
  checkForPremitiveValues,
  checkForObjectType,
  checkForCriteriaObject,
  isRequired,
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
        // this called the criteria object.
        // Example meta : { type: String, requried: true }
        // need to pass the exist check if it's not required
        // if the field exist and its requried so need to validate
        // what if its exsit and not required need to check its type
        // throw an error if it's required and not exist
        if (isRequired(schemaFieldValue) && !dataFieldValue)
          throwError(`${schemaField} field is required`);
        if (
          isRequired(schemaFieldValue) &&
          checkForPremitiveValues(schemaFieldValue.type, dataFieldValue)
        ) {
          throwError(
            ` Field "${schemaField}" expected type of ${typeof schemaFieldValue.type()} but get type of ${typeof dataFieldValue} `
          );
        }
        if (
          dataFieldValue &&
          !isRequired(schemaFieldValue) &&
          checkForPremitiveValues(schemaFieldValue.type, dataFieldValue)
        ) {
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
