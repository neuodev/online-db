const {
  throwError,
  getDataJson,
  checkForArrayAnyMatch,
  checkSeclect,
  checkForArrayExactMatch,
} = require('../utils/utils');
const { isEmail } = require('../types/typesUtils');
const { selectionInvalidType } = require('../errors/collectionErrors');
const fs = require('fs');
module.exports.emailCheck = (schemaFieldValue, dataFieldValue, schemaField) => {
  if (schemaFieldValue.isEmail && dataFieldValue) {
    if (!isEmail(dataFieldValue))
      throwError(` Invalid email for the field ${schemaField} `);
  }
};

module.exports.regExpCheck = (
  schemaFieldValue,
  dataFieldValue,
  schemaField
) => {
  if (schemaFieldValue.regExp && dataFieldValue) {
    if (!(schemaFieldValue.regExp instanceof RegExp))
      throwError(`Invalid regular expressions for the field ${schemaField}`);

    if (!schemaFieldValue.regExp.test(dataFieldValue))
      throwError(
        ` "${dataFieldValue}" doesn't match regExp ( ${schemaFieldValue.regExp} ) in the ${schemaField} field  `
      );
  }
};

module.exports.checkApplyBasicOperators = (field, filterValue, data) => {
  if (!data) return;
  if (filterValue.$gt) {
    data = data.filter(item => item[field] > filterValue.$gt);
  } else if (filterValue.$gte) {
    data = data.filter(item => item[field] >= filterValue.$gte);
  }

  if (filterValue.$lt) {
    data = data.filter(item => item[field] < filterValue.$lt);
  } else if (filterValue.$lte) {
    data = data.filter(item => item[field] <= filterValue.$lte);
  }

  return data;
};
module.exports.checkApplyBasicOperatorsReverse = (field, filterValue, data) => {
  if (!data) return;
  if (filterValue.$gt) {
    data = data.filter(item => item[field] < filterValue.$gt);
  } else if (filterValue.$gte) {
    data = data.filter(item => item[field] <= filterValue.$gte);
  }

  if (filterValue.$lt) {
    data = data.filter(item => item[field] > filterValue.$lt);
  } else if (filterValue.$lte) {
    data = data.filter(item => item[field] >= filterValue.$lte);
  }

  return data;
};

// To combare nisted values
module.exports.checkDeepEquality = (filter, item, filterValue) => {
  let fieldArray = filter.split('.');

  let targetField = item;
  for (let subField of fieldArray) {
    targetField = targetField[subField];
  }

  if (typeof targetField !== 'undefined' && targetField === filterValue)
    return true;

  return false;
};

module.exports.checkNotOperators = (field, filterValue, item) => {
  for (let filedsNotToHave of filterValue.$not) {
    if (filedsNotToHave === item[field]) return false;
  }

  return true;
};

module.exports.checkApplyNotOperator = (field, filterValue, data) => {
  if (filterValue.$not) {
    data = data.filter(item =>
      this.checkNotOperators(field, filterValue, item)
    );
  }
  return data;
};

module.exports.applyAndOperator = (filterValue, data) => {
  for (let expression in filterValue) {
    const expressionValue = filterValue[expression];
    for (let field in expressionValue) {
      const filedValue = expressionValue[field];
      data = this.checkApplyBasicOperators(field, filedValue, data);

      if (typeof filedValue !== 'object') {
        data = data.filter(doc => doc[field] === filedValue);
      }
    }
  }

  return data;
};

module.exports.checkApplyNorOperator = (field, filterValue, data) => {
  if (field !== '$nor') return data;
  for (let expression in filterValue) {
    const expressionValue = filterValue[expression];
    for (let field in expressionValue) {
      const filedValue = expressionValue[field];
      data = this.checkApplyBasicOperatorsReverse(field, filedValue, data);

      if (typeof filedValue !== 'object') {
        data = data.filter(doc => doc[field] !== filedValue);
      }
    }
  }

  return data;
};

module.exports.checkApplyOrOperator = (field, filterValue, data) => {
  if (field !== '$or') return data;
  let dataCopy = [...data];
  for (let expression in filterValue) {
    const expressionValue = filterValue[expression];
    for (let field in expressionValue) {
      const filedValue = expressionValue[field];
      data = this.checkApplyBasicOperators(field, filedValue, data);
      if (typeof filedValue !== 'object') {
        data = data.filter(doc => doc[field] === filedValue);
      }
    }

    if (data.length !== 0) return data;
    else data = dataCopy;
  }

  return data;
};

module.exports.checkApplyAllOperator = (field, filterValue, data) => {
  if (!filterValue.$all) return data;

  if (!(filterValue.$all instanceof Array))
    throwError(
      `In "${field}" Field, $all operator accept an array but get a/an ${typeof filterValue}`
        .bgRed
    );
  if (data.length === 0) return data;
  if (!(data[0][field] instanceof Array))
    throwError(
      ` $all operator used only to query a exact match array but the "${field}" field is a/an ${typeof data[0][
        field
      ]} `.bgRed
    );

  return data.filter(document =>
    checkForArrayExactMatch(document[field], filterValue.$all)
  );
};

module.exports.checkApplyInOperator = (field, filterValue, data) => {
  if (!filterValue.$in) return data;

  if (!(filterValue.$in instanceof Array))
    throwError(
      `In "${field}" Field, $in operator accept an array but get a/an ${typeof filterValue}`
        .bgRed
    );
  if (data.length === 0) return data;
  if (!(data[0][field] instanceof Array))
    throwError(
      ` $in operator used only to query a exact match array but the "${field}" field is a/an ${typeof data[0][
        field
      ]} `.bgRed
    );

  return data.filter(document =>
    checkForArrayAnyMatch(document[field], filterValue.$in)
  );
};

function getCurrentField(fieldsToSortBy, item) {
  const isNestedField = fieldsToSortBy[0].split('.').length > 1;

  if (!isNestedField) {
    let currentSortedField = fieldsToSortBy[0];

    let currentField = currentSortedField.startsWith('-')
      ? currentSortedField.slice(1)
      : currentSortedField;
    return currentField;
  }
  let nestedFields = fieldsToSortBy[0].split('.');

  let field = item;

  for (let subField of nestedFields) {
    let correctSubField = subField;
    if (subField.startsWith('-')) correctSubField = subField.slice(1);
    field = field[correctSubField];
  }
  return field;
}

module.exports.applySorting = (filters, data) => {
  const fieldsToSortBy = filters.sort.split(' ');
  let currentSortedField = fieldsToSortBy[0];
  // sort by chars
  // sort by nesting field
  // accept many values
  let currentFieldType = getCurrentField(fieldsToSortBy, data[0]);
  if (typeof currentFieldType === 'number') {
    data = data.sort((a, b) => {
      let currentFieldA = getCurrentField(fieldsToSortBy, a);
      let currentFieldB = getCurrentField(fieldsToSortBy, b);
      if (!currentSortedField.startsWith('-')) {
        return currentFieldA - currentFieldB;
      } else {
        return currentFieldB - currentFieldA;
      }
    });
  }
  if (typeof currentFieldType === 'string') {
    data = data.sort((a, b) => {
      let currentFieldA = getCurrentField(fieldsToSortBy, a);
      let currentFieldB = getCurrentField(fieldsToSortBy, b);
      if (!currentSortedField.startsWith('-')) {
        if (currentFieldA < currentFieldB) return -1;
        else if (currentFieldA > currentFieldB) return 1;
        return 0;
      }
      if (currentSortedField.startsWith('-')) {
        if (currentFieldA < currentFieldB) return 1;
        if (currentFieldA > currentFieldB) return -1;
        return 0;
      }
      return 0;
    });
  }

  return data;
};

module.exports.applySelection = (select, data) => {
  selectionInvalidType(select);
  let selectedData = [];
  if (select.length === 0) {
    throwError('Please add selected fileds ');
  }
  const fieldsToSelect = select.split(' ');
  checkSeclect(fieldsToSelect);
  for (let document of data) {
    let newDocument = {};
    for (let selectedField of fieldsToSelect) {
      let correctSelectedField = selectedField.startsWith('-')
        ? selectedField.slice(1)
        : selectedField;

      if (!selectedField.startsWith('-')) {
        if (document[correctSelectedField]) {
          newDocument[correctSelectedField] = document[correctSelectedField];
        }
      } else {
        delete document[correctSelectedField];

        newDocument = { ...document };
      }
    }

    selectedData.push(newDocument);
  }

  return selectedData;
};

module.exports.applySelectionRelation = (select, firstCollection, field) => {
  selectionInvalidType(select);

  if (select.length === 0) {
    throwError('Please add selected fileds ');
  }
  const fieldsToSelect = select.split(' ');
  checkSeclect(fieldsToSelect);

  for (let firstDocument of firstCollection) {
    let newDocument = {
      [field]: {},
    };
    for (let selectedField of fieldsToSelect) {
      let correctSelectedField = selectedField.startsWith('-')
        ? selectedField.slice(1)
        : selectedField;

      if (!selectedField.startsWith('-')) {
        if (firstDocument[field][correctSelectedField]) {
          newDocument[field][correctSelectedField] =
            firstDocument[field][correctSelectedField];
        }
      } else {
        delete firstDocument[field][correctSelectedField];

        newDocument = { [field]: firstDocument[field] };
      }
    }

    firstDocument[field] = newDocument[field];
  }

  return firstCollection;
};
module.exports.applySelectionRelationMany = (
  select,
  firstCollection,
  field
) => {
  selectionInvalidType(select);
  if (select.length === 0) {
    throwError('Please add selected fileds ');
  }
  const fieldsToSelect = select.split(' ');
  checkSeclect(fieldsToSelect);

  // one loop for the main document
  for (let firstDocument of firstCollection) {
    let newDocument = {
      [field]: [],
    };

    let relatedDocArray = [];
    // second loop for the sub document
    for (let secondDoc of firstDocument[field]) {
      // last one for the sub fields
      let newSubDocument = {};
      for (let selectedField of fieldsToSelect) {
        let correctSelectedField = selectedField.startsWith('-')
          ? selectedField.slice(1)
          : selectedField;

        if (!selectedField.startsWith('-')) {
          if (secondDoc[correctSelectedField]) {
            newSubDocument[correctSelectedField] =
              secondDoc[correctSelectedField];
          }
        } else {
          delete secondDoc[correctSelectedField];

          newSubDocument = { ...secondDoc };
        }
      }
      relatedDocArray.push(newSubDocument);
    }
    firstDocument[field] = relatedDocArray;
  }

  return firstCollection;
};

module.exports.checkApplyUnique = (
  schemaFieldValue,
  dataFieldValue,
  schemaField,
  dbName,
  collection
) => {
  if (typeof schemaFieldValue.unique !== 'boolean') return;
  const PATH = `./OnlineDB/${dbName}/${collection}.onlinedb.db`;
  if (!fs.existsSync(PATH))
    throwError(
      ` "${collection}" doesn't exist on the "${dbName}" database  `.bgRed
    );
  const conllection = getDataJson(PATH);

  const isExist = conllection.findIndex(
    document => document[schemaField] === dataFieldValue
  );

  if (isExist !== -1)
    throwError(
      ` Document with the "${schemaField}" already has this value ( should be unique ), Dublicaiton error`
        .bgRed
    );
};
