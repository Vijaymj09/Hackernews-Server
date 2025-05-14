"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerRoutes = void 0;
const hono_1 = require("hono");
const openapi_js_1 = require("../docs/openapi.js");
const swagger_ui_1 = require("@hono/swagger-ui");
exports.swaggerRoutes = new hono_1.Hono();
exports.swaggerRoutes.get("/doc", (c) => c.json(openapi_js_1.openapi));
exports.swaggerRoutes.get("/ui", (0, swagger_ui_1.swaggerUI)({ url: "/doc" }));
