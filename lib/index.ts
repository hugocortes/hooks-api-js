import * as boom from 'boom';
import * as glue from 'glue';
import * as hapi from 'hapi';

import Config from './config';
import * as pkg from './../package.json';

export class Server {
  public server: hapi.Server;

  public constructor() {
    this.server;
  }

  public async start(): Promise<hapi.Server> {
    try {
      this.server = await glue.compose(
        Config.manifestOpts,
        Config.glueOpts
      );

      this.server.events.on('response', this.onResponseLogger);

      await this.server.start();
      this.server.logger.info(`${pkg.name} running on ${this.server.info.uri}`);

      return this.server;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    return this.server.stop();
  }

  private onResponseLogger(request: hapi.Request): void {
    const {
      method,
      path,
      query,
      response,
      info: { received, responded },
    } = request;

    let statusCode;
    if (!(response instanceof boom)) {
      statusCode = response.statusCode;
    }

    let msg =
      `${method.toUpperCase()}, code: ${statusCode},` +
      `t: ${responded - received} ms -> ${path} ${JSON.stringify(query)}`;

    if (statusCode < 400) {
      request.server.logger.verbose(msg);
    } else {
      request.server.logger.error(msg);
    }
  }
}
