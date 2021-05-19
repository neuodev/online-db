const { throwError } = require('../utils/utils');
const checkObjectTypeError = (
  subSchemaField,
  schemaField,
  dataFieldValue,
  schemaFieldValue
) => {
  throwError(
    ` Field "${subSchemaField} in ${schemaField} object" expected type of ${typeof schemaFieldValue[
      subSchemaField
    ]()} but get type of ${typeof dataFieldValue[subSchemaField]} `
  );
};

module.exports = {
  checkObjectTypeError,
};
