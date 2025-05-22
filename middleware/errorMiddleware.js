// middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);

  // Custom status code if set, otherwise 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥷' : err.stack,
  });
};

module.exports = errorHandler;
 