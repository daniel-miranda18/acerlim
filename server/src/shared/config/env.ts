import "dotenv/config";

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  TZ: process.env.TZ ?? "America/La_Paz",
  JWT_SECRET: process.env.JWT_SECRET || "acerlim_jwt_secret_2026",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "8h",
};
