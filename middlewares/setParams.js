const setLocalEJSParams = (req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.user = req.user;
  next();
};
module.exports = setLocalEJSParams;
