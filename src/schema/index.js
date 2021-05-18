module.exports = class Schema {
  constructor(schemaFields) {
    this.schema = schemaFields;
    this.getTypes();
  }

  getTypes() {
    console.log(typeof this.schema);
  }
};
