const { FileDB } = require('./index');

const main = () => {
  // create db
  const db = new FileDB('db');

  const user = db.createCollection('user');

  //   user.insertMany([{ id: '1', name: 'Jone', age: 50 }]);
  //   const users = user.find();
  //   const findUser = user.findOneById('4');
  //   console.log(findUser);

  // const findUser = user.findOne({
  //   name: 'Jone',
  // });

  try {
    user.updateOneById('1', {
      age: 80,
    });
  } catch (err) {
    console.log(err.message);
  }
};

main();
