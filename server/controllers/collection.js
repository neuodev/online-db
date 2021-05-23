const fs = require('fs');
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

  const Document = ctx.find(
    item => item.database.toLowerCase() === databaseLowercase
  ).documents;

  console.log(Document);

  res.status(201).json({ success: true });
};
