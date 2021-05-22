const fs = require('fs');
const readline = require('readline');
function initDB(dbName) {
  if (!dbName) throw new Error('DB name is required');
  if (!fs.existsSync('./OnlineDB')) fs.mkdirSync('./OnlineDB');
  let validDBName = dbName.toLowerCase();
  if (!fs.existsSync(`./OnlineDB/${validDBName}`))
    fs.mkdirSync(`./OnlineDB/${validDBName}`);
}
function isDocExist(collectionPath) {
  return fs.existsSync(collectionPath);
}

function docNotFoundError() {
  throw new Error("Document doesn't exist");
}

function throwError(message) {
  throw new Error(message);
}

function getDataJson(collectionPath) {
  const allDocs = fs.readFileSync(collectionPath);
  return JSON.parse(allDocs);
}

function writeData(data, collectionPath) {
  if (!data) this._throwError("Data isn't exist ");
  fs.writeFileSync(collectionPath, JSON.stringify(data));
}

// ['age']
function checkSeclect(selectArray) {
  let isSelect = !selectArray[0].startsWith('-') ? true : false;
  let currentState = isSelect;

  for (let field of selectArray) {
    if (
      (isSelect && field.startsWith('-')) ||
      (!isSelect && !field.startsWith('-'))
    )
      throwError('"Select" can only select on remove value  '.red);
  }
}

function getRelatedCollection(dbName, collectionName) {
  const PATH = `./OnlineDB/${dbName}/${collectionName}.json`;

  if (!fs.existsSync(PATH)) {
    throwError(` "${collectionName}" Doesn't exist on your database `.bgRed);
  }

  return getDataJson(PATH);
}

function printDB() {
  const database = fs.readdirSync('./OnlineDB');
  console.log(database);
  process.exit(0);
}

function printCollections() {
  if (!process.argv[3])
    return console.log('showCol should have a database name after it '.bgBlue);

  // database name
  const db = process.argv[3];
  // check if the db exist
  const PATH = `./OnlineDB/${db}`;
  if (!fs.existsSync(PATH))
    return console.log(` "${db}" database Doesn't exist `.bgBlue);
  const files = fs.readdirSync(PATH);
  let collections = [];

  for (let file of files) {
    collections.push(file.split('.')[0]);
  }
  console.log(collections);
  process.exit(0);
}

function dropDB() {
  if (!process.argv[3])
    return console.log(
      ` You should provide the database name to drop it `.bgBlue
    );
  // check if it exist
  const db = process.argv[3];
  const PATH = `./OnlineDB/${db}`;
  if (!fs.existsSync(PATH))
    return console.log(` "${db}" Doesn't exist `.bgBlue);
  // ask for confirm
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // remove it
  rl.question('Are You Sure?[y/n] ', function (answer) {
    if (answer.toLocaleLowerCase() === 'y') {
      fs.rmdirSync(PATH, { recursive: true });
      console.log(`"${db}" Database deleted`.bgCyan);
    }
    rl.close();
  });

  rl.on('close', function () {
    console.log('\nBYE BYE !!!'.bgCyan);
    process.exit(0);
  });
}

module.exports = {
  isDocExist,
  docNotFoundError,
  throwError,
  getDataJson,
  writeData,
  initDB,
  checkSeclect,
  getRelatedCollection,
  printDB,
  printCollections,
  dropDB,
};
