// Example environment configuration
export const jwtSecretKey = process.env.JWT_SECRET_KEY || process.exit(1);
const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3000,
  };
  

export const databaseUrl = process.env.DATABASE_URL || process.exit(1);
export const directUrl = process.env.DIRECT_URL || process.exit(1);

export const serverUrl = process.env.SERVER_URL || process.exit(1);
export const webClientUrl = process.env.WEB_CLIENT_URL || process.exit(1);
export const betterAuthSecret = process.env.BETTER_AUTH_SECRET || process.exit(1);
export { env };