const fs = require('fs');

module.exports.getDatabases = (req, res, next) => {
  // like -> [firstDatase, secondDatabse]
  let results = {};
  const databases = fs.readdirSync();

  for (let database of databases) {
    const files = fs.readdirSync(database);
    let collections = [];
    for (let fileName of files) {
      collections.push(fileName.split('.')[0]);
    }
    results[database] = collections;
  }

  res.status(200).json(results);
};
