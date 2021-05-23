const { checkUpdateArrayWithValidType } = require('../types/types');
const { throwError, checkForArrayOpertors } = require('../utils/utils');

module.exports.applyUpdates = (data, schema, updates) => {
  //   @todo -> what will happen if the schema is optional
  for (document of data) {
    for (let field in updates) {
      const fieldUpdateValue = updates[field];
      const currentFieldValue = document[field];
      const params = [schema, document, field, fieldUpdateValue];
      //   update an array
      if (currentFieldValue instanceof Array) {
        updateArrayField(...params);
      }
      //   update any first level field
      else if (typeof currentFieldValue !== 'undefined') {
        updateFirstLevelField(...params);
      }
      //   update nested values
      else {
        updateNestedField(...params);
      }
    }
  }

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
    if (typeof targetField[subField] === 'undefined')
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
    let schema = document; // a moving reference to internal objects within obj
    let pList = path.split('.');
    let len = pList.length;
    for (var i = 0; i < len - 1; i++) {
      var elem = pList[i];
      if (!schema[elem]) schema[elem] = {};
      schema = schema[elem];
    }

    schema[pList[len - 1]] = value;
  }

  set(field, fieldUpdateValue);
}

function updateArrayField(schema, document, field, fieldUpdateValue) {
  // check that we don't have empty object
  // check if the field value is an array or not
  checkForArrayOpertors(fieldUpdateValue);

  const [operator, newValues] = Object.entries(fieldUpdateValue)[0];
  //  make sure that he update with right type of data
  checkUpdateArrayWithValidType(newValues, schema);
  const params = [document, field, operator, newValues];
  document = applyAddOperator(...params);
  document = applyPopOperator(...params);
  document = applyReplaceOperator(...params);
  document = applyRemoveOperator(...params);
}

function applyAddOperator(document, field, operator, newValues) {
  if (operator !== '$add') return document;

  for (let newValue of newValues) {
    document[field].push(newValue);
  }

  return document;
}

function applyPopOperator(document, field, operator, newValues) {
  if (operator !== '$pop' || newValues !== true) return document;
  document[field].pop();
  return document;
}

function applyReplaceOperator(document, field, operator, newValues) {
  if (operator !== '$replace') return document;
  document[field] = newValues;
  return document;
}
function applyRemoveOperator(document, field, operator, newValues) {
  if (operator !== '$remove') return document;
  const valuesSet = new Set(newValues);
  document[field] = document[field].filter(item => !valuesSet.has(item));
  return document;
}
