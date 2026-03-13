import "dotenv/config";

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  TZ: process.env.TZ ?? "America/La_Paz",
};
