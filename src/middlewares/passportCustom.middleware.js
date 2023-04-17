//this middleware is needed to be able to manage the errors

const passport = require("../middlewares/passport.middleware");

const passportCustom = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (error, user, info) => {
      if (error) {
        return next(error); //specific errors
      }
      if (!user) {
        return res
          .status(401)
          .json({ error: info.messages ? info.messages : `${info}` }); // authentication errors
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

module.exports = { passportCustom };
