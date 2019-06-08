/**
 * Typescript additional declarations
 */

import * as boom from 'boom';
import * as superagent from 'superagent';
import * as winston from 'winston';

declare module 'hapi' {
  export interface Server {
    logger: winston.Logger;
  }
  export interface ResponseToolkit {
    badImplementation: (message?: string, data?: object) => boom;
    badRequest: (message?: string, data?: object) => boom;
    forbidden: (message?: string, data?: object) => boom;
    internal: (message?: string, data?: object) => boom;
    notFound: (message?: string, data?: object) => boom;
    unauthorized: (message?: string, data?: object) => boom;
    processError: (
      request: Request,
      h: ResponseToolkit,
      error?: Error | boom | superagent.ResponseError
    ) => boom;
  }
}

declare module 'winston' {
  interface Logger {
    db: (message?: string) => Logger;
    test: (message?: string) => Logger;
  }
}
