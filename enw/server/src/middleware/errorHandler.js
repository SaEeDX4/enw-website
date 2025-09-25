import logger from "../utils/logger.js";

export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  // Log error
  logger.error({
    error: err,
    request: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Don't leak error details in production
  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    statusCode = 500;
    message = "Something went wrong!";
  }

  res.status(statusCode).json({
    success: false,
    error: {
      statusCode,
      message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
