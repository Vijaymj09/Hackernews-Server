"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const hono_1 = require("hono");
const node_server_1 = require("@hono/node-server");
const routes_js_1 = require("./routes/routes.js");
const process_1 = require("process");
const prisma_js_1 = require("./extras/prisma.js");
const app = new hono_1.Hono();
// Mount all routes
app.route("/", routes_js_1.allRoutes);
// Error handling middleware
app.onError((err, c) => {
    console.error(`${err}`);
    return c.json({
        message: "Internal Server Error",
        error: process_1.env.NODE_ENV === "development" ? err.message : undefined,
    }, 500);
});
// Not found handler
app.notFound((c) => {
    return c.json({
        message: "Not Found",
    }, 404);
});
// Start the server
const port = process_1.env.PORT ? parseInt(process_1.env.PORT.toString(), 10) : 3000;
console.log(`Server is running on port ${port}`);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port,
});
// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM signal received: closing server");
    await prisma_js_1.prismaClient.$disconnect();
    process.exit(0);
});
process.on("SIGINT", async () => {
    console.log("SIGINT signal received: closing server");
    await prisma_js_1.prismaClient.$disconnect();
    process.exit(0);
});
