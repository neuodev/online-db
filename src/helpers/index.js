const { throwError } = require('../utils/utils');
const { isEmail } = require('../types/typesUtils');
module.exports.emailCheck = (schemaFieldValue, dataFieldValue, schemaField) => {
  if (schemaFieldValue.isEmail && dataFieldValue) {
    if (!isEmail(dataFieldValue))
      throwError(` Invalid email for the field ${schemaField} `);
  }
};

module.exports.regExpCheck = (
  schemaFieldValue,
  dataFieldValue,
  schemaField
) => {
  if (schemaFieldValue.regExp && dataFieldValue) {
    if (!(schemaFieldValue.regExp instanceof RegExp))
      throwError(`Invalid regular expressions for the field ${schemaField}`);

    if (!schemaFieldValue.regExp.test(dataFieldValue))
      throwError(
        ` "${dataFieldValue}" doesn't match regExp ( ${schemaFieldValue.regExp} ) in the ${schemaField} field  `
      );
  }
};
