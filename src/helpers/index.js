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
  if (!data) return;
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

  return data;
};

// To combare nisted values
module.exports.checkDeepEquality = (filter, item, filterValue) => {
  let fieldArray = filter.split('.');

  let targetField = item;
  for (let subField of fieldArray) {
    targetField = targetField[subField];
  }

  if (typeof targetField !== 'undefined' && targetField === filterValue)
    return true;

  return false;
};
