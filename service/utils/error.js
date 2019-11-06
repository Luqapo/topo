/* eslint-disable max-classes-per-file */
class RequestError extends Error {
  constructor(message) {
    super(message);
    this.code = 'request_error';
  }
}
class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.code = 'conflict';
  }
}
class NoSuchInstanceError extends Error {
  constructor(message) {
    super(message);
    this.code = 'no_such_instance';
  }
}

class ArgumentError extends Error {
  constructor(message) {
    super(message);
    this.code = 'arg_error';
  }
}

function handleError(ctx, err) {
  /* istanbul ignore next */
  switch(err.code) {
    case 'conflict':
      return ctx.throw(409, err);
    case 'request_error':
      return ctx.throw(400, err);
    case 'no_such_instance':
      return ctx.throw(404, err);
    case 'arg_error':
      return ctx.throw(500, err);
    default:
      throw err;
  }
}

module.exports = {
  RequestError,
  ConflictError,
  NoSuchInstanceError,
  ArgumentError,
  handleError,
};
