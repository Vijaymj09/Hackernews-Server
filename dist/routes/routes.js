"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoutes = void 0;
const hono_1 = require("hono");
const swagger_ui_1 = require("@hono/swagger-ui");
const authentication_routes_js_1 = require("./authentication-routes.js");
const users_routes_js_1 = require("./users-routes.js");
const posts_routes_js_1 = require("./posts-routes.js");
const likes_routes_js_1 = require("./likes-routes.js");
const comments_routes_js_1 = require("./comments-routes.js");
const cors_1 = require("hono/cors");
const session_middleware_js_1 = require("./middlewares/session-middleware.js");
const environment_js_1 = require("../environment.js");
exports.allRoutes = new hono_1.Hono();
exports.allRoutes.use((0, cors_1.cors)({
    origin: [environment_js_1.webClientUrl],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "token"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
}));
exports.allRoutes.get("/ui", (0, swagger_ui_1.swaggerUI)({ url: "/docs" }));
exports.allRoutes.route("/api/auth", session_middleware_js_1.authRoute);
exports.allRoutes.route("/authen", authentication_routes_js_1.authenticationRoutes);
exports.allRoutes.route("/users", users_routes_js_1.usersRoutes);
exports.allRoutes.route("/posts", posts_routes_js_1.postsRoutes);
exports.allRoutes.route("/likes", likes_routes_js_1.likesRoutes);
exports.allRoutes.route("/comments", comments_routes_js_1.commentsRoutes);
