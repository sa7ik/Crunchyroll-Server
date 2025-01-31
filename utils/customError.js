class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode || 500;
      this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = CustomError;