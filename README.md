# OnlineDB

Fast, unopinionated, minimalist, open source, No-SQL database uses document data model for store and retrieve data.

## Simple example

          const { OnlineDB } = require('onlinedb');

          const db = new OnlineDB('db');

          const user = db.createCollection('users');

          user.insertOne({
            name: 'jone',
            email: 'jone@test.com',
            isDeveloper: true,
            age: 32,
            hobbies: ['sport', 'cooking', 'coding'],
          });

          const users = user.find();

## Advanced schema usage 
        const userSchema = new Schema({
            {
            title: String, 
            author: String,
            body: String,
            comments: [{ body: String, date: Date }],
            hidden: Boolean,
            meta: {
              votes: Number,
              favs: Number,
            },

            age: {
              type: Number,
              required: true,
              minValue: 25,
              maxValue: 100,
            },

            text: {
              type: String,
              required: true,
              default: 'false',
              maxLength: 20,
              minLength: 3,
            },

            email: {
              type: String,
              regExp:
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            },

            role: {
              type: String,
              enum: ['ADMIN', 'STAFF', 'USER'],
            },
          });}


