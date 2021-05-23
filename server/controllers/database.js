const fs = require('fs');

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

  res.status(200).json(results);
};

//@desc  Create new Database
//@route POST api/v1/database/:dbName
//@access Public
module.exports.createDatabase = (req, res, next) => {
  const { dbName } = req.query;
  const { document } = req.body;

  // check if the db exist
  const isExist = fs.existsSync(`./OnlineDB/${dbName}`);
  if (isExist)
    return res.status(400).json({ error: `${dbName} already exist` });

  // create the database
  fs.mkdirSync(`./OnlineDB/${dbName}`);

  // create an optional document
  if (document) {
    const DOC_PATH = `./OnlineDB/${dbName}/${document}`;
    if (fs.existsSync(DOC_PATH)) {
      res.status(400).json({ error: 'Document already exist' });
      return;
    }

    fs.mkdirSync(DOC_PATH);
  }

  res.status(201).json({ success: true });
};
