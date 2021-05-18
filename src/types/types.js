const { throwError } = require("../utils/utils");

const checkArrayOfType = (dataFieldValue, schemaFieldValue, schemaField) => {
  for (let item of dataFieldValue) {
    if (typeof item !== typeof schemaFieldValue[0].type()) {
      throwError(
        `Exprected field ${schemaField} to be array of ${typeof schemaFieldValue[0].type()} but get ${typeof dataFieldValue[
          item
        ]}`
      );
    }
  }
};

module.exports = {
  checkArrayOfType,
};
