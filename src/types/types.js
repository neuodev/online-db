const { checkObjectTypeError } = require('../errors/schemaErrors');
const { throwError } = require('../utils/utils');
const { checkForPremitiveValues } = require('./typesUtils');

const checkArrayOfType = (dataFieldValue, schemaFieldValue, schemaField) => {
  for (let item of dataFieldValue) {
    if (typeof item !== typeof schemaFieldValue[0].type()) {
      throwError(
        `Exprected field ${schemaField} to be array of ${typeof schemaFieldValue[0].type()} but got ${typeof item}`
      );
    }
  }
};

const checkArrayType = (dataFieldValue, schemaField, schemaFieldValue) => {
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
            ` Field ${subSchemaField} expected type of ${typeof subSchema[
              subSchemaField
            ]()} but get type of ${typeof subDataItem[subSchemaField]} `
          );
        }
      }
    }
  }
};

const checkObjectType = (schemaFieldValue, dataFieldValue, schemaField) => {
  for (let subSchemaField in schemaFieldValue) {
    if (
      checkForPremitiveValues(
        schemaFieldValue[subSchemaField],
        dataFieldValue[subSchemaField]
      )
    ) {
      checkObjectTypeError(
        subSchemaField,
        schemaField,
        dataFieldValue,
        schemaFieldValue
      );
    }
  }
};

module.exports = {
  checkArrayOfType,
  checkArrayType,
  checkObjectType,
};
