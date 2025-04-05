"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMiddleware = void 0;
const factory_1 = require("hono/factory");
const jwt = require("jsonwebtoken");
const environment_js_1 = require("../../environment.js");
exports.tokenMiddleware = (0, factory_1.createMiddleware)(async (context, next) => {
    // Extract token from the 'token' header
    const token = context.req.header("token");
    // If no token is provided, return 401 Unauthorized
    if (!token) {
        return context.json({
            message: "Missing Token",
        }, 401);
    }
    try {
        // Verify the token using the secret key
        const payload = jwt.verify(token, environment_js_1.jwtSecretKey);
        // Extract userId from the token's 'sub' field
        const userId = payload.sub;
        // If userId is missing or invalid, return 401 Unauthorized
        if (!userId) {
            return context.json({
                message: "Unauthorized",
            }, 401);
        }
        // Set userId in the context for downstream use
        context.set("userId", userId);
        // Proceed to the next middleware or route handler
        await next();
    }
    catch (e) {
        // If token verification fails (e.g., invalid or expired token), return 401 Unauthorized
        return context.json({
            message: "Unauthorized",
        }, 401);
    }
});
