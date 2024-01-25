import { Configuration } from './types';

export const configuration = (): Configuration => ({
  port: Number(process.env.PORT) || 3000,
});
