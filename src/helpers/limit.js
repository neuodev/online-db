const { throwError } = require('../utils/utils');

module.exports = function limit(limit, data) {
  if (typeof limit !== 'number') throwError('Limit expected to be a number');
  return data.slice(0, limit);
};
