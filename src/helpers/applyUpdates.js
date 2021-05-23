const { throwError } = require('../utils/utils');

module.exports.applyUpdates = (data, schema, updates) => {
  //   @todo -> what will happen if the schema is optional
  for (document of data) {
    for (let field in updates) {
      const fieldUpdateValue = updates[field];
      const currentFieldValue = document[field];
      //   update an array
      if (currentFieldValue instanceof Array) {
      }
      //   update any first level field
      else if (typeof currentFieldValue !== 'undefined') {
        // console.log(currentFieldValue);
        updateFirstLevelField(schema, document, field, fieldUpdateValue);
      }
      //   update nested values
      else {
        // console.log(field.split('.'));
      }
    }
  }

//   console.log(data);

  return data;
};

function updateFirstLevelField(schema, document, field, fieldUpdateValue) {
  // check for citeria object or simple Type
  const schemaFieldValue = schema[field];
  //   console.log(schema[field], field, fieldUpdateValue);
  let schemaType;
  const updateType = typeof fieldUpdateValue;
  if (typeof schemaFieldValue === 'object') {
    schemaType = typeof schemaFieldValue.type();
  } else {
    schemaType = typeof schemaFieldValue();
  }
  if (schemaType !== updateType)
    throwError(
      ` "${field}" should be of type "${schemaType}" but get type of "${updateType}"`
        .bgRed
    );

  // Update the document
  document[field] = fieldUpdateValue;
}
