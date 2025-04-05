"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.jwtSecretKey = void 0;
// Example environment configuration
exports.jwtSecretKey = process.env.JWT_SECRET_KEY || process.exit(1);
exports.env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3000,
};
