const { throwError } = require('../utils/utils');

const checkForPremitiveValues = (schemaFieldValue, dataFieldValue) => {
  return (
    typeof schemaFieldValue === 'function' &&
    typeof schemaFieldValue() !== typeof dataFieldValue
  );
};

const isObjectType = schemaFieldValue => {
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
  //   if (schemaFieldValue.required ) return true;
  if (typeof schemaFieldValue.required === 'undefined') return true;
  if (
    schemaFieldValue.required &&
    typeof schemaFieldValue.required !== 'boolean'
  )
    throwError(`required field can only be a boolean ( true or false )`);

  return schemaFieldValue.required;
};

const isEmail = email => {
  const emailRegEx =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return emailRegEx.test(email);
};
module.exports = {
  checkForPremitiveValues,
  isObjectType,
  checkForCriteriaObject,
  isRequired,
  isEmail,
};
