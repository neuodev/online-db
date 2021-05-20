const colors = require('colors');
const { checkApplyBasicOperators } = require('.');
module.exports.applyFilter = (filters, data) => {
  console.log(filters);
  for (let filter in filters) {
    let filterValue = filters[filter];
    if (filterValue instanceof Array) {
      console.log('Array'.bgWhite);
    } else if (filterValue instanceof Object) {
      data = checkApplyBasicOperators(data);
    } else if (typeof filters[filter] !== 'object') {
      data = data.find(item => item[filter] == filters[filter]);
    }
  }
};
