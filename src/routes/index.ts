import { Hono } from "hono";

import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { usersRoutes } from "../controllers/users";
import { postsRoutes } from "../controllers/posts";
import { likeRoutes } from "../controllers/likes";
import { commentRoutes } from "../controllers/comments";
import { authenticationRoutes } from "../routes/authentication-routes";
import { webClientUrl } from "../environment";
import { authRoute } from "./middlewares/session-middleware";

export const allRoutes = new Hono();
allRoutes.use(
  "*",
  cors({
    origin: "https://hackernews-www-y93o.vercel.app", // ✅ Only allow your frontend
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Global logger
allRoutes.use(logger());

// Route groups
//allRoutes.route("/auth", authenticationRoutes);
allRoutes.route("/users", usersRoutes);
allRoutes.route("/posts", postsRoutes);
allRoutes.route("/likes", likeRoutes);
allRoutes.route("/comments", commentRoutes);
allRoutes.route("/api/auth", authRoute); 