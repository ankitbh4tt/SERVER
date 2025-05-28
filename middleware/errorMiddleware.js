// middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);

  // Agar res.statusCode pehle se set hai toh use karo, warna 500
  let statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose bad ObjectId error
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Handle Mongoose duplicate key error
  if (err.code && err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered for '${field}'`;
  }

  // Handle Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    // Collect all validation errors into one message
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please log in again.";
  }

  // If you have Zod errors (validation library)
  if (err.name === "ZodError") {
    statusCode = 400;
    message = err.errors
      .map((e) => `${e.path.join(".")} - ${e.message}`)
      .join(", ");
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    // Production mein stack trace hide karenge, dev mein dikhayenge
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = errorHandler;
