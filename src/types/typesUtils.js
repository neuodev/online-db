const checkForPremitiveValues = (schemaFieldValue, dataFieldValue) => {
  return (
    typeof schemaFieldValue === 'function' &&
    typeof schemaFieldValue() !== typeof dataFieldValue
  );
};

const checkForObjectType = schemaFieldValue => {
  return (
    schemaFieldValue instanceof Object &&
    typeof schemaFieldValue !== 'function' &&
    !schemaFieldValue.type
  );
};

module.exports = {
  checkForPremitiveValues,
  checkForObjectType,
};
