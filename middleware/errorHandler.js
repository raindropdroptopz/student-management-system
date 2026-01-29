module.exports = function errorHandler(err, req, res, next) {
  console.error("ERROR", err);

  if (err && err.name === "MulterError") {
    return res.status(400).json ({
      success: false,
      message: "File upload error: ",
      error: err.code
    });
  }

  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};