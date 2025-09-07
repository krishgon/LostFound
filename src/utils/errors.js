// Custom error classes for consistent error handling
// Provides standardized HTTP error responses with appropriate status codes

/**
 * Base HTTP Error class
 * Extends the built-in Error class to include HTTP status codes
 * @param {number} status - HTTP status code
 * @param {string} message - Error message
 */
class HttpError extends Error {
    constructor(status, message) {
      super(message);
      this.status = status;
    }
  }
  
  // Predefined error constructors for common HTTP status codes
  const BadRequest = (msg="Bad Request") => new HttpError(400, msg);           // 400 - Client sent invalid request
  const Unauthorized = (msg="Unauthorized") => new HttpError(401, msg);         // 401 - Authentication required
  const Forbidden = (msg="Forbidden") => new HttpError(403, msg);               // 403 - Access denied
  const NotFound = (msg="Not Found") => new HttpError(404, msg);                // 404 - Resource not found
  
  module.exports = { HttpError, BadRequest, Unauthorized, Forbidden, NotFound };
  