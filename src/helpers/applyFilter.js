const colors = require('colors');
const {
  checkApplyBasicOperators,
  checkDeepEquality,
  checkApplyNotOperator,
  applyAndOperator,
  checkApplyNorOperator,
  checkApplyOrOperator,
  applySorting,
} = require('.');
const { throwError } = require('../utils/utils');
module.exports.applyFilter = (filters, data) => {
  for (let field in filters) {
    if (field === 'select') continue;
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
    data = applySorting(filters, data);
  }

  return data;
};
