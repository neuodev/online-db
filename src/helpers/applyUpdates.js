const { throwError } = require('../utils/utils');

module.exports.applyUpdates = (data, schema, updates) => {
  //   @todo -> what will happen if the schema is optional
  for (document of data) {
    for (let field in updates) {
      const fieldUpdateValue = updates[field];
      const currentFieldValue = document[field];
      const params = [schema, document, field, fieldUpdateValue];
      //   update an array
      if (currentFieldValue instanceof Array) {
      }
      //   update any first level field
      else if (typeof currentFieldValue !== 'undefined') {
        // console.log(currentFieldValue);
        updateFirstLevelField(...params);
      }
      //   update nested values
      else {
        // console.log(field.split('.'));
        updateNestedField(...params);
      }
    }
  }

  //   console.log(data);

  return data;
};

function updateFirstLevelField(schema, document, field, fieldUpdateValue) {
  // check for citeria object or simple Type
  const schemaFieldValue = schema[field];
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

function updateNestedField(schema, document, field, fieldUpdateValue) {
  const fieldPath = field.split('.');
  let schemaPath = schema;
  let targetField = document;
  for (let subField of fieldPath) {
    if (!targetField[subField])
      throwError(`Path ${field} doesn't exist in the document`.bgRed);
    targetField = targetField[subField];
    schemaPath = schemaPath[subField];
  }
  const schemaType = typeof schemaPath();
  const fieldType = typeof fieldUpdateValue;
  if (schemaType !== fieldType) {
    throwError(
      ` "${field}" should be of type ${schemaType} but get type ${fieldType} `
    );
  }

  function set(path, value) {
    var schema = document; // a moving reference to internal objects within obj
    var pList = path.split('.');
    var len = pList.length;
    for (var i = 0; i < len - 1; i++) {
      var elem = pList[i];
      if (!schema[elem]) schema[elem] = {};
      schema = schema[elem];
    }

    schema[pList[len - 1]] = value;
  }

  set(field, fieldUpdateValue);
}
