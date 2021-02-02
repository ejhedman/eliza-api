// tslint:disable:no-unused-expression

import * as moment from 'moment';
import { HttpError } from './errors';

export const handleApiError = async (error: any, req: any, res: any, logger: any) => {
  const selfUrl = req.apiUrls.selfUrl;
  const appBase = req.apiUrls.appBase;

  let errorResponse;
  if (error instanceof HttpError) {
    errorResponse = {
      errors: [
        {
          status: error.statusCode,
          title: error.statusTitle,
          detail: error.detail,
          source: { url: selfUrl },
        },
      ],
    };
  } else {
    errorResponse = {
      errors: [
        {
          status: 500,
          title: 'Server Error',
          detail: error.message,
          source: { url: selfUrl },
          stack: error.stack,
        },
      ],
    };
  }

  const statusCode = error.statusCode || 500;
  logger && logger.error(`Error: ${JSON.stringify(errorResponse)}`);
  res.status(statusCode).send(errorResponse);
};

export const handleEventError = async (error: any, req: any, res: any, logger: any) => {
  const selfUrl = req.apiUrls.selfUrl;
  const appBase = req.apiUrls.appBase;

  let errorResponse;
  if (error instanceof HttpError) {
    errorResponse = {
      errors: [
        {
          status: error.statusCode,
          title: error.statusTitle,
          detail: error.detail,
          source: { url: selfUrl },
        },
      ],
      // EJH: Add payload to http error of figure out if this is used.
      // "payload": error.payload
    };
  } else {
    errorResponse = {
      errors: [
        {
          status: 500,
          title: 'Server Error',
          detail: error.message,
          source: { url: selfUrl },
          stack: error.stack,
        },
      ],
      payload: error.payload,
    };
  }

  // default to "no retry" return code
  const statusCode = 202;
  logger && logger.error(`Error: ${JSON.stringify(errorResponse)}`);

  res.status(statusCode).send(errorResponse);
};
