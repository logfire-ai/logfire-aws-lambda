import { Logfire } from '@logfire-sh/node';
import { parseRecords } from './src/parser.js';

// Set up Logfire logger
if (!process.env.LOGFIRE_SOURCE_TOKEN) {
  throw new Error(
    'Logfire source token has not been set in ENV variable LOGFIRE_SOURCE_TOKEN.'
  );
}
const options = {};
if (process.env.LOGFIRE_ENTRYPOINT) {
  options.endpoint = process.env.LOGFIRE_ENTRYPOINT;
}
const logger = new Logfire(process.env.LOGFIRE_SOURCE_TOKEN, options);

// Main entrypoint for Lambda
export async function handler(event, context) {
  const records = await parseRecords(event, context);

  return await Promise.all(
    records.map((record) =>
      logger.log(record.message, record.level, record.data)
    )
  );
}
