import dotenv from 'dotenv';

dotenv.config();

export const env = {
  OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY ?? '',
  AI_DEVS_API_KEY: process.env.AI_DEVS_API_KEY ?? '',
};
