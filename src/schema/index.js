const { throwError } = require('../utils/utils');

module.exports = class Schema {
  constructor(schemaFields) {
    this.schema = schemaFields;
  }

  validateDataAganistSchema(data) {
    for (let schemaField in this.schema) {
      const schemaType = typeof this.schema[schemaField]();
      const dataType = typeof data[schemaField];
      if (schemaType !== dataType) {
        throwError(
          ` Field ${schemaField} expected type of ${schemaType} but get type of ${dataType} `
        );
      }
    }
  }
};
