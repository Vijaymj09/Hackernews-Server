"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationRoutes = void 0;
const hono_1 = require("hono");
const authentication_controller_js_1 = require("../controllers/authentication/authentication-controller.js");
const authentication_types_js_1 = require("../controllers/authentication/authentication-types.js");
exports.authenticationRoutes = new hono_1.Hono();
// Sign-up endpoint (POST instead of GET as per REST conventions)
exports.authenticationRoutes.post("/sign-up", async (context) => {
    try {
        const { username, password, name } = await context.req.json();
        if (!username || !password) {
            return context.json({
                message: "Username and password are required",
            }, 400);
        }
        const result = await (0, authentication_controller_js_1.signUpWithUsernameAndPassword)({
            username,
            password,
            name,
        });
        return context.json({
            data: {
                token: result.token,
                user: {
                    id: result.user.id,
                    username: result.user.username,
                    name: result.user.name,
                },
            },
        }, 201);
    }
    catch (e) {
        if (e === authentication_types_js_1.SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
            return context.json({
                message: "Username already exists",
            }, 409);
        }
        console.error("Sign-up error:", e);
        return context.json({
            message: "Internal Server Error",
        }, 500);
    }
});
// Log-in endpoint (POST instead of GET as per REST conventions)
exports.authenticationRoutes.post("/log-in", async (context) => {
    try {
        const { username, password } = await context.req.json();
        if (!username || !password) {
            return context.json({
                message: "Username and password are required",
            }, 400);
        }
        const result = await (0, authentication_controller_js_1.logInWithUsernameAndPassword)({
            username,
            password,
        });
        return context.json({
            data: {
                token: result.token,
                user: {
                    id: result.user.id,
                    username: result.user.username,
                    name: result.user.name,
                },
            },
        }, 200);
    }
    catch (e) {
        if (e === authentication_types_js_1.LogInWtihUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD) {
            return context.json({
                message: "Incorrect username or password",
            }, 401);
        }
        console.error("Log-in error:", e);
        return context.json({
            message: "Internal Server Error",
        }, 500);
    }
});
