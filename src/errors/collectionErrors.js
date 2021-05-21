const { throwError } = require('../utils/utils');

const selectionInvalidType = select => {
  if (typeof select === 'string') return;
  throwError(
    `Expected select to be of type string but get type of ${typeof select}`
  );
};

module.exports = {
  selectionInvalidType,
};
