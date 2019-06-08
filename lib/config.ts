import * as hapi from 'hapi';
import * as dotenv from 'dotenv';

import * as pkg from '../package.json';

dotenv.config();

const {
  HOST,
  PORT,
  LOG_LEVEL,

  REDIS_HOST,
  REDIS_PORT,
  REDIS_AUTH,
  REDIS_KEY,
} = process.env;

const plugins = [
  /** Server decorations */
  {
    plugin: './decorator',
    options: {
      serverOpts: {
        level: LOG_LEVEL,
        label: pkg.name,
      },
    },
  },
];

const glueOpts = {
  relativeTo: `${__dirname}/modules`,
};

const manifestOpts = {
  server: {
    host: HOST,
    port: PORT,
    cache: [
      {
        name: 'redisCache',
        provider: {
          constructor: require('catbox-redis'),
          options: {
            default: true,
            host: REDIS_HOST,
            port: REDIS_PORT,
            password: REDIS_AUTH,
            partition: REDIS_KEY,
          },
        },
      },
    ],
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
        additionalHeaders: ['x-requested-with'],
      },
      validate: {
        failAction: async (
          request: hapi.Request,
          h: hapi.ResponseToolkit,
          error: Error
        ): Promise<void> => {
          throw h.processError(request, h, error);
        },
      },
    },
  },
  register: {
    plugins,
  },
};

export default { glueOpts, manifestOpts };
