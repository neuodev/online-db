const fs = require('fs');
const ErrorResponse = require('../utils/ErrorResponse');
//@desc   get document details
//@route  PUT api/v1/collection/:database/:collection
//@access Public
module.exports.getDocumentDtails = (req, res, next) => {
  const { database, collection } = req.params;
  const databaseLowercase = database.toLowerCase();
  const collectionLowercase = collection.toLowerCase();
  // check if the db exist
  const DB_PATH = `./OnlineDB/${databaseLowercase}`;
  const isDBExist = fs.existsSync(DB_PATH);
  if (!isDBExist) return next(new ErrorResponse(`Database not found`, 400));

  // check if the collection exist
  const COLLECTION_PATH = `./OnlineDB/${databaseLowercase}/${collectionLowercase}.onlinedb.db`;
  const isDocExist = fs.existsSync(COLLECTION_PATH);
  if (!isDocExist) return next(new ErrorResponse(`Collection not found`, 400));
  const ctx = req.context;

  const DB = ctx.find(item => item.database.dbName === databaseLowercase);

  if (!DB)
    return next(
      new ErrorResponse(
        `"${databaseLowercase}" datbase isn't provided in the context`,
        400
      )
    );

  const currentCollection = DB.documents.find(
    col => col.colName === collectionLowercase
  );

  if (!currentCollection)
    return next(
      new ErrorResponse(
        `"${collectionLowercase}" collection isn't provided in the context`,
        400
      )
    );

  const { colName, dbName, collectionPath, schema } = currentCollection;
  const schemaCopy = { ...schema.schema };
  res
    .status(201)
    .json({ colName, dbName, collectionPath, schema: schema.schema });
};
