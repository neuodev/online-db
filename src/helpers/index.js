const { throwError } = require('../utils/utils');
const { isEmail } = require('../types/typesUtils');
module.exports.emailCheck = (schemaFieldValue, dataFieldValue) => {
  if (schemaFieldValue.isEmail && dataFieldValue) {
    if (!isEmail(dataFieldValue)) throwError('Invalid email');
  }
};
