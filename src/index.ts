// src/index.ts
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { allRoutes } from "./routes/routes.js";
import { env } from "process";
import { prismaClient } from "./extras/prisma.js";


const app = new Hono();

// Mount all routes
app.route("/", allRoutes);

// Error handling middleware
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json(
    {
      message: "Internal Server Error",
      error: env.NODE_ENV === "development" ? err.message : undefined,
    },
    500
  );
});

// Not found handler
app.notFound((c) => {
  return c.json(
    {
      message: "Not Found",
    },
    404
  );
});

// Start the server
const port = env.PORT ? parseInt(env.PORT.toString(), 10) : 3000;

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing server");
  await prismaClient.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT signal received: closing server");
  await prismaClient.$disconnect();
  process.exit(0);
});