import * as hapi from 'hapi';
import * as dotenv from 'dotenv';

dotenv.config();

const { HOST, PORT } = process.env;

const plugins = [];

const glueOpts = {
  relativeTo: `${__dirname}/modules`,
};

const manifestOpts = {
  server: {
    host: HOST,
    port: PORT,
    // cache: [],
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
