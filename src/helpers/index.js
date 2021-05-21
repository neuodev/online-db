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
module.exports.checkApplyBasicOperatorsReverse = (field, filterValue, data) => {
  if (!data) return;
  if (filterValue.$gt) {
    data = data.filter(item => item[field] < filterValue.$gt);
  } else if (filterValue.$gte) {
    data = data.filter(item => item[field] <= filterValue.$gte);
  }

  if (filterValue.$lt) {
    data = data.filter(item => item[field] > filterValue.$lt);
  } else if (filterValue.$lte) {
    data = data.filter(item => item[field] >= filterValue.$lte);
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

module.exports.checkNotOperators = (field, filterValue, item) => {
  for (let filedsNotToHave of filterValue.$not) {
    if (filedsNotToHave === item[field]) return false;
  }

  return true;
};

module.exports.checkApplyNotOperator = (field, filterValue, data) => {
  if (filterValue.$not) {
    data = data.filter(item =>
      this.checkNotOperators(field, filterValue, item)
    );
  }
  return data;
};

module.exports.applyAndOperator = (filterValue, data) => {
  for (let expression in filterValue) {
    const expressionValue = filterValue[expression];
    for (let field in expressionValue) {
      const filedValue = expressionValue[field];
      data = this.checkApplyBasicOperators(field, filedValue, data);

      if (typeof filedValue !== 'object') {
        data = data.filter(doc => doc[field] === filedValue);
      }
    }
  }

  return data;
};

module.exports.checkApplyNorOperator = (field, filterValue, data) => {
  if (field !== '$nor') return data;
  for (let expression in filterValue) {
    const expressionValue = filterValue[expression];
    for (let field in expressionValue) {
      const filedValue = expressionValue[field];
      data = this.checkApplyBasicOperatorsReverse(field, filedValue, data);

      if (typeof filedValue !== 'object') {
        data = data.filter(doc => doc[field] !== filedValue);
      }
    }
  }

  return data;
};

module.exports.checkApplyOrOperator = (field, filterValue, data) => {
  if (field !== '$or') return data;
  let dataCopy = [...data];
  for (let expression in filterValue) {
    const expressionValue = filterValue[expression];
    for (let field in expressionValue) {
      const filedValue = expressionValue[field];
      data = this.checkApplyBasicOperators(field, filedValue, data);
      if (typeof filedValue !== 'object') {
        data = data.filter(doc => doc[field] === filedValue);
      }
    }

    if (data.length !== 0) return data;
    else data = dataCopy;
  }

  return data;
};

module.exports.checkApplyAllOperator = () => {};

module.exports.applySorting = (filters, data) => {
  const fieldsToSortBy = filters.sort.split(' ');
  let currentSortedField = fieldsToSortBy[0];

  let currentField = currentSortedField.startsWith('-')
    ? currentSortedField.slice(1)
    : currentSortedField;
  // sort by chars
  // sort by nesting field
  // accept many values
  if (typeof data[0][currentField] === 'number') {
    data = data.sort((a, b) => {
      if (!currentSortedField.startsWith('-')) {
        return a[currentField] - b[currentField];
      } else {
        return b[currentField] - a[currentField];
      }
    });
  }
  if (typeof data[0][currentField] === 'string') {
    data = data.sort((a, b) => {
      console.log(currentSortedField, currentField);
      if (
        !currentSortedField.startsWith('-') &&
        a[currentField] < b[currentField]
      ) {
        return -1;
      }
      if (
        a[currentField] > b[currentField] &&
        currentSortedField.startsWith('-')
      ) {
        return 1;
      }
      return 0;
    });
  }

  return data;
};
