/**
 * Global Error Handling Middleware
 * Handles various error types and returns standardized JSON responses
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errorType = err.name || "InternalError";

  // Handle Prisma Specific Errors
  if (err.code) {
    switch (err.code) {
      case 'P2002': // Unique constraint failed
        statusCode = 409;
        message = "A record with this information already exists.";
        errorType = "ConflictError";
        break;
      case 'P2025': // Record not found
        statusCode = 404;
        message = "The requested record was not found.";
        errorType = "NotFoundError";
        break;
      case 'P2003': // Foreign key constraint failed
        statusCode = 400;
        message = "Invalid reference data provided.";
        errorType = "ValidationError";
        break;
      default:
        // Handle other Prisma codes if necessary
        break;
    }
  }

  // Handle Express Rate Limit
  if (err.type === 'request-limit') {
    statusCode = 429;
    message = "Too many requests. Please try again later.";
    errorType = "RateLimitError";
  }

  // Handle Validation Errors (e.g., from a library like Joi or Zod if added later)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorType = "ValidationError";
  }

  res.status(statusCode).json({
    success: false,
    error: {
      type: errorType,
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
