const { throwError } = require('../utils/utils');

module.exports = class Schema {
  constructor(schemaFields) {
    this.schema = schemaFields;
  }

  validateDataAganistSchema(data) {
    for (let schemaField in this.schema) {
      const schemaFieldValue = this.schema[schemaField];
      const dataFieldValue = data[schemaField];

      // if(typeof )

      if (
        typeof schemaFieldValue === 'function' &&
        typeof schemaFieldValue() !== typeof dataFieldValue
      ) {
        throwError(
          ` Field ${typeof schemaFieldValue()} expected type of ${typeof schemaFieldValue()} but get type of ${typeof dataFieldValue} `
        );
      }
    }
  }
};
