const { throwError } = require('../utils/utils');

const invalidPopulateQuery = populate => {
  if (typeof populate == 'string' || populate instanceof Object) return;

  if (populate instanceof Object && !populate.field)
    throwError(` Populate field with type object must have "field" properity `);

  throwError(
    ` Populate properity can only be type of string or an object with "field" key but get type of ${typeof populate} `
  );
};

module.exports = {
  invalidPopulateQuery,
};
