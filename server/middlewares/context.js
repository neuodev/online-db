const OnlineDB = require('../../src');
const Collection = require('../../src/classes/Collection');
const ErrorResponse = require('../utils/ErrorResponse');

module.exports.applyCtx = (req, res, next) => {
  const context = req.context;
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
};
