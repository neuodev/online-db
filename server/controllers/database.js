const fs = require('fs');
const ErrorResponse = require('../utils/ErrorResponse');

//@desc  get all databases and its documents
//@route GET api/v1/database
//@access Public
module.exports.getDatabases = (req, res, next) => {
  // like -> [firstDatase, secondDatabse]
  let results = {};
  const databases = fs.readdirSync('./OnlineDB');

  for (let database of databases) {
    const files = fs.readdirSync(`./OnlineDB/${database}`);
    let collections = [];
    for (let fileName of files) {
      collections.push(fileName.split('.')[0]);
    }
    results[database] = collections;
  }

  if (Object.keys(results).length === 0)
    return next(new ErrorResponse(`No database found`));

  res.status(200).json(results);
};

//@desc  Create new Database
//@route POST api/v1/database/:dbName
//@access Public
module.exports.createDatabase = (req, res, next) => {
  const { dbName } = req.params;
  const { document } = req.body;

  const dbNameLowercase = dbName.toLowerCase();

  // check if the db exist
  const DB_PATH = `./OnlineDB/${dbNameLowercase}`;
  const isExist = fs.existsSync(DB_PATH);
  if (isExist) return next(new ErrorResponse(`Database not found`, 400));

  // create the database
  fs.mkdirSync(DB_PATH);

  // create an optional document
  if (document) {
    const documentLowercase = document.toLowerCase();
    const DOC_PATH = `./OnlineDB/${dbNameLowercase}/${documentLowercase}.onlinedb.db`;
    if (fs.existsSync(DOC_PATH)) {
      return next(new ErrorResponse(`Document not found`, 400));
    }

    fs.writeFileSync(DOC_PATH, JSON.stringify([]));
  }

  res.status(201).json({ success: true });
};

//@desc   Delte database
//@route DELTE api/v1/database/:dbName
//@access Public
module.exports.deleteDatabase = (req, res, next) => {
  const { dbName } = req.params;

  const dbNameLowercase = dbName.toLowerCase();

  // check if the db exist
  const DB_PATH = `./OnlineDB/${dbNameLowercase}`;
  const isExist = fs.existsSync(DB_PATH);
  if (!isExist) return next(new ErrorResponse(`Database not found`, 400));

  // delete the database
  fs.rmdirSync(DB_PATH, { recursive: true });

  res.status(201).json({ success: true });
};

//@desc   update database name
//@route  PUT api/v1/database/:dbName
//@access Public
module.exports.updateDB = (req, res, next) => {
  const { dbName } = req.params;
  const { newDatatbaseName } = req.body;

  if (!newDatatbaseName)
    return next(new ErrorResponse('New database name is required', 400));

  const oldDBNameLowercase = dbName.toLowerCase();
  const newDBNameLowercase = newDatatbaseName.toLowerCase();
  // check if the db exist
  const OLD_DB_PATH = `./OnlineDB/${oldDBNameLowercase}`;

  const NEW_DB_PATH = `./OnlineDB/${newDBNameLowercase}`;
  const isExist = fs.existsSync(OLD_DB_PATH);
  if (!isExist) return next(new ErrorResponse(`Database not found`, 400));

  // update the database name
  fs.renameSync(OLD_DB_PATH, NEW_DB_PATH);

  res.status(201).json({ success: true });
};
