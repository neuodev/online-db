const { throwError } = require('../utils/utils');

module.exports.valueCheck = (schemaFieldValue, dataFieldValue, schemaField) => {
  // make sure to use with strings
  if (typeof schemaFieldValue.type() !== 'number') {
    throwError(
      `minValue property in the "${schemaField}" field used only with numbers but you used "${typeof schemaFieldValue.type()}"`
    );
  }
  const { minValue, maxValue } = schemaFieldValue;
  if (maxValue && dataFieldValue > maxValue)
    throwError(
      `field "${schemaField}" with type "number" must be less than "${maxValue}" `
    );
  if (minValue && dataFieldValue < minValue)
    throwError(
      `field "${schemaField}" with type "number" must be more than "${minValue}" `
    );
};
