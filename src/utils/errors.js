class HttpError extends Error {
    constructor(status, message) {
      super(message);
      this.status = status;
    }
  }
  
  const BadRequest = (msg="Bad Request") => new HttpError(400, msg);
  const Unauthorized = (msg="Unauthorized") => new HttpError(401, msg);
  const Forbidden = (msg="Forbidden") => new HttpError(403, msg);
  const NotFound = (msg="Not Found") => new HttpError(404, msg);
  
  module.exports = { HttpError, BadRequest, Unauthorized, Forbidden, NotFound };
  