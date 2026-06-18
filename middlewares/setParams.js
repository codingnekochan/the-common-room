const setLocalEJSParams = (req, res, next) => {
  res.locals.currentPath = req.path;
  next();
}
module.exports = setLocalEJSParams