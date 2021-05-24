const express = require('express');
const cors = require('cors');
const colros = require('colors');
const databaseRouter = require('./routes/database');
const errorHandler = require('./middlewares/error');
const collectionRouter = require('./routes/collection');
const ErrorResponse = require('./utils/ErrorResponse');

const OnlineDB = require('../src');
const Collection = require('../src/classes/Collection');

const startServer = context => {
  const app = express();

  // access from anoter port
  app.use(cors());

  // To allow write data to the server
  app.use(express.json());

  // inject the database info
  app.use((req, res, next) => {
    // context should be of type array
    if (!(context instanceof Array))
      next(
        new ErrorResponse(
          `Expected the context to be type "array" but get type"${typeof context}"`
        )
      );
    // every item should be an object with two fields database -> string , documents array

    for (let info of context) {
      const { database, documents } = info;
      console.log(database instanceof OnlineDB);
      if (typeof database == 'undefined')
        return next(new ErrorResponse(`Missing the database field`, 400));

      if (!(database instanceof OnlineDB))
        return next(new ErrorResponse(`Invalide database field`, 400));

      if (typeof documents === 'undefined')
        return next(new ErrorResponse(`Missing the documents field`, 400));

      if (!(documents instanceof Array))
        return next(
          new ErrorResponse(
            `document field expected to be an array but get a/an ${typeof documents}`,
            400
          )
        );
      for (let document of documents) {
        if (!(document instanceof Collection))
          return next(
            new ErrorResponse(`"${document}" is not a valid document `, 400)
          );
      }
    }

    req.context = context;
    next();
  });

  // API Routes
  app.use('/api/v1', databaseRouter);
  app.use('/api/v1', collectionRouter);

  // Error Handling
  app.use(errorHandler);
  const PORT = 9000;
  app.listen(PORT, () =>
    console.log(`Visualize you database on  http://localhost:${PORT} `.bgGreen)
  );
};

module.exports = {
  startServer,
};
