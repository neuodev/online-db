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

           // <!-- this is sort hand for  { type: String } -->
           
            title: String,  
            author: String,
            body: String,
            // <!-- This how you define an array of items  -->
            
            // <!-- Now you have an array of comments each comment should have and object with the body and the data and both of them are required  -->
            
            comments: [{ body: String, date: Date }],
            
            // <!-- Hidden will be only true or false  -->
            
            hidden: Boolean, 
            
            // <!-- You can have as many nested levels as you want  -->
            
            meta: {
              votes: Number,
              favs: Number,
            },
            
           // <!-- the age field will be of type number and it's equired. it has min and max vlaue  -->
           
            age: {
              type: Number,
              required: true,
              minValue: 25,
              maxValue: 100,
            },
            
           // <!-- Text field will be of type string and it's equired. it has min and max lenths  -->
           
            text: {
              type: String,
              required: true,
              default: 'Hello world text edition',
              maxLength: 255,
              minLength: 10,
            },
            
            // <!-- Email field should be of type strig but not any string. It should match the provided regular expersion -->
            
            email: {
              type: String,
              regExp:
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
            },
            
          //  <!-- role field will be of type string but not any string it should be one of these three values and this is the defination of `enum` -->
          
            role: {
              type: String,
              enum: ['ADMIN', 'STAFF', 'USER'],
            },
          });}


Note: if there is any some thing that is not clear feel free to open an issue on github :)

#
# Relation Between Data

Now You can apply relation between data like `one to one`, `many to one`, `one to many`, `many to one` 

It maybe seems as a complex topic but believe me OnlineDB makes it ease now 

First make an empty folder

        mkdir myshop

Start new project using npm

        npm init -y

now install the package

        npm install onlinedb 

create and index.js file any type this

        // myshop/index.js 

        const { OnlineDB, Schema } = require('./index');

        const db = new OnlineDB('database');

        const userSchema = new Schema({
        id: String,
        name: String,
        products: [
          {
            type: 'ObjectId',
            ref: 'product',
          },
        ],
        });

        const productSchema = new Schema({
          id: String,
          name: String,
          user: {
            type: 'ObjectId',
            ref: 'user',
          },
        });

* So what happened that we imported the main OnlineDB class and the schema. if you new to the no-sql world the schema is how our data should look like

* so we created two collections

* In user collection → every user can have multiple products so this is one to many relation

* this how we define it

* Use `Array` to represent many relationship and every item should be object with type ObjectId and ref field

* `ObjectId`
the ObjectId type for OnlineDB so it will now that you want a relation

* `Ref` this field is required you have to provide it. it just a pointer to another collection

* In the product Schema → every product should have one user who own it so this one to many relation

* to apply this relation we have user field that have type of ObjectId → to tell OnlineDB that we want a relation here and a ref field that point to another collection

* And here we are. you have it now a relation between your data

## Next you need to create a collection in our example we have two collections
        const User = db.createCollection('user', userSchema);
        const Product = db.createCollection('product', productSchema);

### Time to have a data in your database → notice that we stored the ids of the products in an array in the user collection → this how OnlineDB will parse this items one at a time


### Also notice that in the product collection you have in each product a user field and its value is the id of this user in this way OnlineDB will understand that when you query for products it will replace the user field id with actual information
        if (process.argv[2] === '-i') {
          User.insertMany([
            { id: '1', name: 'jone', products: ['1', '2'] },
            { id: '2', name: 'Jane', products: ['2'] },
            { id: '3', name: 'Ahmed', products: ['3'] },
            { id: '4', name: 'more one ', products: ['4'] },
            { id: '5', name: 'someone ', products: ['5'] },
          ]);
          Product.insertMany([
            { id: '1', name: 'Apply MacBook Pro', user: '1' },
            { id: '2', name: 'Apply MacBook Air', user: '2' },
            { id: '3', name: 'Iphone Pro', user: '3' },
            { id: '4', name: 'iMac M1 ', user: '4' },
            { id: '5', name: 'iPad pro ', user: '5' },
          ]);
        }
## Now Time to query your data
### Go a long with me here now we are querying for all users and we need them to have the information for each product
* So we add the populate method that have field property and this field represent witch field we want to populate witch in our case is products and you have it now. if you print the users in the console you will have each user an his products
* Wait for a second what about this select property this for select witch fields to return in the products collection it only accept a string with space separated values as each value represent a field in our example it will only return the name and id fields for the products collection

              try {
                const users = User.find({
                  populate:{
                    field: 'products',
                    select: 'name id'
                  },
                });
              } catch (error) {
                console.log(error);
              }

This package is created by Ahmed Ibrahim. If you want to show any support just leave a comment or contact me ahmedibarhim556@gmail.com
