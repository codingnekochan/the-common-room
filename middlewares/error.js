const globalErrorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).render("500");
};
const mapError = (errorArray) => {
  return errorArray
    .array()
    .map((item) => item.msg)
    .join(". ");
};
module.exports = { globalErrorHandler, mapError };
