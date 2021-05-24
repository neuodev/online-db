const deepcopy = require('deepcopy');
module.exports.parseSchema = schema => {
  const schemaCopy = deepcopy(schema);

  for (let field in schemaCopy) {
    let fieldValue = schemaCopy[field];
    if (typeof fieldValue === 'function') {
      // like id: String
      schemaCopy[field] = typeof fieldValue();
    } else if (
      fieldValue instanceof Array &&
      typeof fieldValue[0] === 'function'
    ) {
      // comments = [Numbers]
      schemaCopy[field] = [typeof fieldValue[0]()];
    } else if (
      fieldValue instanceof Array &&
      typeof fieldValue[0] !== 'function' &&
      fieldValue[0].type !== 'ObjectId'
    ) {
      // comments = [{body: String}]
      for (let arraySubField in fieldValue[0]) {
        const arraySubFieldValue = fieldValue[0][arraySubField];

        schemaCopy[field][0][arraySubField] = typeof arraySubFieldValue();
      }
    } else if (
      fieldValue instanceof Object &&
      typeof fieldValue.type === 'undefined'
    ) {
      // meta: {body: String, date: Date}
      for (let subField in fieldValue) {
        // first level
        const subFieldValue = fieldValue[subField];
        if (typeof subFieldValue === 'function') {
          // body: String
          schemaCopy[field][subField] = typeof subFieldValue();
        } else if (
          subFieldValue instanceof Object &&
          typeof subFieldValue.type !== 'undefined'
        ) {
          if (subFieldValue.type !== 'ObjectId') {
            // body: {type: String}
            schemaCopy[field][subField] = typeof subFieldValue.type();
          } else {
            schemaCopy[field] = `Many ${subFieldValue.ref}`;
          }
        }
      }
      // muliple levels
    } else if (
      fieldValue instanceof Object &&
      typeof fieldValue.type !== 'undefined'
    ) {
      if (fieldValue.type == 'ObjectId') {
        schemaCopy[field] = `One ${fieldValue.ref}`;
      } else {
        // name: {type: String, required: true}
        schemaCopy[field] = { ...schema[field] };
        schemaCopy[field].type = typeof fieldValue.type();
      }
    }
  }

  return schemaCopy;
};
