const { writeData } = require('../utils/utils');

module.exports = class Save {
  constructor(data, collectionPath) {
    this.collectionPath = collectionPath;
    this.data = data;
  }

  save() {
    writeData(this.data, this.collectionPath);
  }
};
