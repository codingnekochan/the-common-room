const setLocalEJSParams = (req, res, next) => {
    console.log(req.user,'setting user')
  res.locals.currentPath = req.path;
  res.locals.user = req.user;
  next();
};
module.exports = setLocalEJSParams;
