const { throwError } = require('../utils/utils');

module.exports.lengthCheck = (
  schemaFieldValue,
  dataFieldValue,
  schemaField
) => {
  // make sure to use with strings
  if (typeof schemaFieldValue.type() !== 'string') {
    throwError(
      `MaxLength property in the "${schemaField}" field used only with strings but you used "${typeof schemaFieldValue.type()}"`
    );
  }
  const { maxLength, minLength } = schemaFieldValue;
  if (maxLength && dataFieldValue.length > maxLength)
    throwError(
      `field "${schemaField}" with type "string" must be less than "${maxLength}" character length `
    );
  if (minLength && dataFieldValue.length < minLength)
    throwError(
      `field "${schemaField}" with type "string" must be more than "${minLength}" character length `
    );
};
