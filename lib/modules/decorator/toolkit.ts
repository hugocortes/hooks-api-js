import * as hapi from 'hapi';
import * as boom from 'boom';
import * as superagent from 'superagent';

const DECORATE_TYPE = 'toolkit';

function processError(
  request: hapi.Request,
  h: hapi.ResponseToolkit,
  error?: Error | boom | superagent.ResponseError
): boom {
  const {
    method,
    path,
    query,
    server: { logger },
  } = request;

  let boom = null;
  if (!error) {
    boom = h.badImplementation();
  } else if (error instanceof boom) {
    boom = error;
  } else {
    boom = new boom(error.message);
  }

  logger.error(
    `${method.toUpperCase()}, code: ${
      boom.output.statusCode
    } -> ${path} ${JSON.stringify(query)}, stack: ${
      error.stack ? error.stack : error.message
    }`
  );

  return boom;
}

export function init(server: hapi.Server): void {
  const httpErrors = [
    'badImplementation',
    'badRequest',
    'forbidden',
    'internal',
    'notFound',
    'unauthorized',
  ];

  httpErrors.forEach(
    (httpError: string): void => {
      server.decorate(DECORATE_TYPE, httpError, boom[httpError]);
    }
  );

  server.decorate(DECORATE_TYPE, 'processError', processError);
}
