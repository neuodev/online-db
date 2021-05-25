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
    const { database, collections } = info;

    if (typeof database == 'undefined')
      return next(new ErrorResponse(`Missing the database field`, 400));

    if (!(database instanceof OnlineDB))
      return next(new ErrorResponse(`Invalide database field`, 400));

    if (typeof collections === 'undefined')
      return next(new ErrorResponse(`Missing the collections field`, 400));

    if (!(collections instanceof Array))
      return next(
        new ErrorResponse(
          `document field expected to be an array but get a/an ${typeof collections}`,
          400
        )
      );
    for (let collection of collections) {
      if (!(collection instanceof Collection))
        return next(
          new ErrorResponse(`"${collection}" is not a valid document `, 400)
        );
    }
  }

  req.context = context;
  next();
};
