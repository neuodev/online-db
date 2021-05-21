const colors = require('colors');
const { checkApplyBasicOperators, checkDeepEquality } = require('.');
module.exports.applyFilter = (filters, data) => {
  for (let field in filters) {
    let filterValue = filters[field];
    if (filterValue instanceof Array) {
      console.log('Array'.bgWhite);
    } else if (filterValue instanceof Object) {
      // check and apply the basic operator if they exist $gt, $gte, $lt, $lte
      data = checkApplyBasicOperators(field, filterValue, data);
    } else if (typeof filters[field] !== 'object') {
      data = data.filter(item => checkDeepEquality(field, item, filterValue));
    }
  }
  console.log(data);
  return data;
};
