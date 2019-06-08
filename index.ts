import * as fs from 'fs';
import * as DotEnv from 'dotenv';

import { Server } from './lib';

DotEnv.config();

// Catch unhandling unexpected exceptions
process.on(
  'uncaughtException',
  (error: Error): void => {
    console.error(`uncaughtException ${error.message}`);
  }
);

// Catch unhandling rejected promises
process.on(
  'unhandledRejection',
  (reason: object): void => {
    console.error(`unhandledRejection ${reason}`);
  }
);

/**
 * Validate all expected env values are present
 */
function validateEnvConfig(): void {
  const envConfig = DotEnv.parse(fs.readFileSync('.env.example'));
  let isMissingSystemVar = false;
  Object.entries(envConfig).forEach(
    ([key]): void => {
      if (!process.env[key]) {
        console.error(`missing system variable: ${key}`);
        isMissingSystemVar = true;
      }
    }
  );
  if (isMissingSystemVar) {
    process.exit(1);
  }
}

validateEnvConfig();
new Server().start();
