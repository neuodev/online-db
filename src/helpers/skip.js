const { throwError } = require('../utils/utils');

module.exports.skip = (data, skip) => {
  if (typeof skip !== 'number')
    throwError('Expected skip to be of type number');

    return data.slice(skip)
};
