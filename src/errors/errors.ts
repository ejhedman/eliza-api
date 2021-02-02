// tslint:disable:max-classes-per-file

export class HttpError extends Error {
  status: number;
  title: string;
  options: any;

  constructor(status: number, title: string, message: string, options: any = {}) {
    super(message);
    this.status = status;
    this.title = title;

    this.options = {};
    for (const [key, value] of Object.entries(options)) {
      this.options[key] = value;
    }
  }

  get name() {
    return this.constructor.name;
  }

  get statusCode() {
    return this.status;
  }

  get statusTitle() {
    return this.title;
  }

  get detail() {
    return this.toString();
  }
}

export class ServerError extends HttpError {
  constructor(message: string, options: any = {}) {
    super(500, 'Server Error', message, options);
  }
}

export class ClientError extends HttpError {
  constructor(message: string, options: any = {}) {
    super(400, 'Client Error', message, options);
  }
}

export class DuplicateError extends HttpError {
  constructor(message: string, options: any = {}) {
    super(409, 'Conflict Error', message, options);
  }
}

export class ArgumentError extends HttpError {
  constructor(message: string, options: any = {}) {
    super(400, 'Client Error', message, options);
  }
}

export class UnprocessableError extends HttpError {
  constructor(message: string, options: any = {}) {
    super(422, 'Unprocessable Error', message, options);
  }
}

export class ValidationError extends ClientError {
  constructor(jsonValidationError: any, options: any = {}) {
    super(jsonValidationError.toString(), options);
  }
}

export class Expired extends UnprocessableError {
  constructor(message: string, options: any = {}) {
    super(message, options);
  }
}

export class TypeError extends ServerError {
  constructor(message: string, options: any = {}) {
    super(message, options);
  }
}

export class NameError extends ServerError {
  constructor(message: string, options: any = {}) {
    super(message, options);
  }
}
