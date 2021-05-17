const { FileDB } = require('./index');

const main = () => {
  // create db
  const db = new FileDB('db');

  const user = db.createDocument('user');
  user.insertMany([
    {
      name: 'Ahmed',
      age: 20,
    },
    {
      name: 'Hend',
      age: 22,
    },
    {
      name: 'Jone',
      age: 50,
    },
  ]);
};

main();
