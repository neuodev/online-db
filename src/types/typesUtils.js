const { throwError } = require('../utils/utils');
const colros = require('colors');
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

const vaildateEnum = (schemaFieldValue, schemaField) => {
  if (!(schemaFieldValue.enum instanceof Array))
    throwError(`Valid enums should be in a array in the  ${schemaField}`.bgRed);

  for (let item of schemaFieldValue.enum) {
    if (typeof item !== typeof schemaFieldValue.type())
      throwError(
        `Invalid Enum: enums for ${schemaField} field must have type of ${typeof schemaFieldValue.type()} but get type of ${typeof item} `
      );
  }
};

const checkEnum = (schemaFieldValue, dataFieldValue, schemaField) => {
  if (schemaFieldValue.enum) {
    // check if it's valid enum or not
    vaildateEnum(schemaFieldValue, schemaField);
    if (
      isRequired(schemaFieldValue) &&
      typeof schemaFieldValue.default !== 'undefined'
    ) {
      // has default → first check the default then match the default to the the field
    }
  }
};

module.exports = {
  checkForPremitiveValues,
  isObjectType,
  checkForCriteriaObject,
  isRequired,
  isEmail,
  checkEnum,
};
