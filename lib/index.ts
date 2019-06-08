import * as glue from 'glue';
import * as hapi from 'hapi';

import Config from './config';

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

      await this.server.start();

      return this.server;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    return this.server.stop();
  }
}
