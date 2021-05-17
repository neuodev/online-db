# FileDB
FileDB is light weight open source No-SQL database uses document data model for store and retrieve data.


## Simple example  
        
          const { FileDB } = require('./file-db');

          const db = new FileDB('db');

          const user = db.createCollection('users');

          user.insertOne({
            name: 'jone',
            email: 'jone@test.com',
            isDeveloper: true,
            age: 32,
            hobbies: ['sport', 'cooking', 'coding'],
          });

          const users = user.find();


          
