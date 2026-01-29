module.exports = function validateUpload(req, res, next) {
  if (!req.file) {
    const err = new Error("No file uploaded");
    err.status = 400;
    return next(err);
  }

  const id = req.params.id;
  if (!id || isNaN(Number(id))) {
    const err = new Error("Student ID must be a number");
    err.status = 400;
    return next(err);
  }

  next();
};