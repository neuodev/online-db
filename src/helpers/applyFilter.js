const colors = require('colors');
const {
  checkApplyBasicOperators,
  checkDeepEquality,
  checkApplyNotOperator,
  applyAndOperator,
  checkApplyNorOperator,
  checkApplyOrOperator,
} = require('.');
const { throwError } = require('../utils/utils');
module.exports.applyFilter = (filters, data) => {
  for (let field in filters) {
    let filterValue = filters[field];

    if (filterValue instanceof Array) {
      const params = [field, filterValue, data];
      // check and apply the and operator
      data = applyAndOperator(filterValue, data);
      // check for logic operator $not
      data = checkApplyNotOperator(...params);
      // check for logic operator $nor
      data = checkApplyNorOperator(...params);
      // check for logic operator $or
      data = checkApplyOrOperator(...params);
    } else if (filterValue instanceof Object) {
      const params = [field, filterValue, data];
      // check and apply the basic operator if they exist $gt, $gte, $lt, $lte
      data = checkApplyBasicOperators(...params);
    } else if (typeof filters[field] !== 'object') {
      if (field === 'sort') continue;
      data = data.filter(item => checkDeepEquality(field, item, filterValue));
    }
  }
  if (typeof filters.sort !== 'undefined') {
    const fieldsToSortBy = filters.sort.split(' ');
    let currentSortedField = fieldsToSortBy[0]
   
    let currentField = currentSortedField.startsWith('-')
      ? currentSortedField.slice(1)
      : currentSortedField;
    console.log(currentField);
    // sort by number
    if (typeof data[0][currentField] === 'number') {
      data = data.sort((a, b) => {
        if (!currentSortedField.startsWith('-')) {
          return a[currentField] - b[currentField];
        } else {
          return b[currentField] - a[currentField];
        }
      });
    }
    // sort by chars
    // sort by nesting field
    // accept many values
  }
  console.log(data);
  return data;
};
