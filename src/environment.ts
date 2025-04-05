// Example environment configuration
export const jwtSecretKey = process.env.JWT_SECRET_KEY || process.exit(1);

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3000,
  };