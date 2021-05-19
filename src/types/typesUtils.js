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
    throwError(`required field can only be a boolean ( true or false )`.red.bold);

  return schemaFieldValue.required;
};

const isEmail = email => {
  const emailRegEx =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return emailRegEx.test(email);
};

const vaildateEnum = (schemaFieldValue, schemaField) => {
  if (!(schemaFieldValue.enum instanceof Array))
    throwError(
      `Valid enums should be an array for the  ${schemaField} field`.red
    );

  for (let item of schemaFieldValue.enum) {
    if (typeof item !== typeof schemaFieldValue.type())
      throwError(
        `Invalid Enum: enums for ${schemaField} field must have type of ${typeof schemaFieldValue.type()} but get type of ${typeof item} for item ${item}`
          .red.bold
      );
  }
};

const validateEnumAgainstField = (
  schemaFieldValue,
  field,
  schemaField,
  isDefault
) => {
  const schemaFieldType = typeof schemaFieldValue.type();
  const dataType = typeof field;
  // 1. check the type
  if (!(schemaFieldType !== dataType) && isDefault) {
    throwError(
      `Default value for ${schemaField} expected to be of type ${schemaFieldType} but get type of ${dataType}`.red.bold
    );
  }
  // 2. check the it is in the enums array

  const findIdx = schemaFieldValue.enum.findIndex(value => value === field);
  if (findIdx === -1)
    throwError(
      ` "${schemaField}" field with value "${field}" doesn't exist on the enum ${JSON.stringify(
        schemaFieldValue.enum
      )} `.red.bold
    );
};

const checkEnum = (schemaFieldValue, dataFieldValue, schemaField) => {
  if (schemaFieldValue.enum) {
    // check if it's valid enum or not
    vaildateEnum(schemaFieldValue, schemaField);
    // has default but not had a value → first check the default then match the default
    if (
      isRequired(schemaFieldValue) &&
      typeof schemaFieldValue.default !== 'undefined' &&
      typeof dataFieldValue === 'undefined'
    ) {
      // has default → first check the default then match the default to the the field
      validateEnumAgainstField(
        schemaFieldValue,
        schemaFieldValue.default,
        schemaField,
        true
      );
    }
    if (isRequired(schemaFieldValue) && typeof dataFieldValue !== 'undefined') {
      // has default → first check the default then match the default to the the field
      validateEnumAgainstField(
        schemaFieldValue,
        dataFieldValue,
        schemaField,
        false
      );
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
