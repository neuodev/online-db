const { throwError } = require('../utils/utils');

const checkForPremitiveValues = (schemaFieldValue, dataFieldValue) => {
  return (
    typeof schemaFieldValue === 'function' &&
    typeof schemaFieldValue() !== typeof dataFieldValue
  );
};

const checkForObjectType = schemaFieldValue => {
  return (
    schemaFieldValue instanceof Object &&
    typeof schemaFieldValue !== 'function' &&
    !schemaFieldValue.type
  );
};

const checkForCriteriaObject = schemaFieldValue => {
  return (
    schemaFieldValue instanceof Object &&
    typeof schemaField !== 'function' &&
    schemaFieldValue.type
  );
};

const isRequired = schemaFieldValue => {
  if (
    schemaFieldValue.required &&
    typeof schemaFieldValue.required !== 'boolean'
  )
    throwError(`required field can only be a boolean ( true or false )`);

  return schemaFieldValue.required;
};
module.exports = {
  checkForPremitiveValues,
  checkForObjectType,
  checkForCriteriaObject,
  isRequired,
};
