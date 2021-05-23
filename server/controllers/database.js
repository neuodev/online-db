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
