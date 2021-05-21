const colors = require('colors');
const {
  checkApplyBasicOperators,
  checkDeepEquality,
  checkApplyNotOperator,
  applyAndOperator,
  checkApplyNorOperator,
} = require('.');
const { throwError } = require('../utils/utils');
module.exports.applyFilter = (filters, data) => {
  for (let field in filters) {
    let filterValue = filters[field];

    if (field === '$and') {
      if (!(filterValue instanceof Array))
        throwError(
          `$and operator should have an array of expreations but got an ${typeof filterValue}`
        );
      data = applyAndOperator(filterValue, data);
    } else if (filterValue instanceof Array) {
      console.log('Array'.bgWhite);
      const params = [field, filterValue, data];
      data = checkApplyNotOperator(...params);
      // check for logic operator $nor
      data = checkApplyNorOperator(...params);
    } else if (filterValue instanceof Object) {
      const params = [field, filterValue, data];
      // check and apply the basic operator if they exist $gt, $gte, $lt, $lte
      data = checkApplyBasicOperators(...params);
      // check for logic operator $not
    } else if (typeof filters[field] !== 'object') {
      data = data.filter(item => checkDeepEquality(field, item, filterValue));
    }
  }
  console.log('data'.bgCyan, data);
  return data;
};
