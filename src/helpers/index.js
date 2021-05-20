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

module.exports.checkApplyBasicOperators = (field, filterValue, data) => {
  console.log(filterValue);
  if (filterValue.$gt) {
    data = data.filter(item => item[field] > filterValue.$gt);
  } else if (filterValue.$gte) {
    data = data.filter(item => item[field] >= filterValue.$gte);
  }

  if (filterValue.$lt) {
    data = data.filter(item => item[field] < filterValue.$lt);
  } else if (filterValue.$lte) {
    data = data.filter(item => item[field] <= filterValue.$lte);
  }
  console.log(data);
  return data;
};
