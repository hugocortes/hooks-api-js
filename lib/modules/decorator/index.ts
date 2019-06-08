import * as hapi from 'hapi';

import * as interfaces from './interfaces';
import * as ServerDecorator from './server';

export async function register(
  server: hapi.Server,
  { serverOpts }: interfaces.DecoratorOpts
): Promise<void> {
  ServerDecorator.init(server, serverOpts);
}

export const name = 'decorator';
