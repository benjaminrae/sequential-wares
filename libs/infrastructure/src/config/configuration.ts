import { Configuration } from './types';

export const configuration = (): Configuration => ({
  port: Number(process.env.PORT) || 3000,
  database: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/sequential-wares',
    debug: process.env.MONGO_DEBUG === 'true',
  },
});
