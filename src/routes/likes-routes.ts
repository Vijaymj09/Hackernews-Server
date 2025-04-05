import { Hono } from "hono";
import { getLikes, createLike, deleteLike } from "../controllers/likes/likes-controller.js";
import { LikeError } from "../controllers/likes/likes-types.js";
import { tokenMiddleware } from "./middlewares/token-middleware.js";


export const likesRoutes = new Hono();

likesRoutes.get("/on/:postId", async (c) => {
  const postId = c.req.param("postId");
  const page = Number(c.req.query("page") || 1);
  const pageSize = Number(c.req.query("pageSize") || 10);
  
  const result = await getLikes({ postId, page, pageSize });
  return c.json({ data: result }, 200);
});

likesRoutes.post("/on/:postId", tokenMiddleware, async (c) => {
  const userId = c.get("userId");
  const postId = c.req.param("postId");
  
  const result = await createLike({ userId, postId });
  return c.json({ data: result }, 201);
});

likesRoutes.delete("/on/:postId", tokenMiddleware, async (c) => {
  const userId = c.get("userId");
  const postId = c.req.param("postId");
  
  try {
    await deleteLike({ userId, postId });
    return c.json({ message: "Like deleted" }, 200);
  } catch (e) {
    if (e === LikeError.NOT_FOUND) return c.json({ message: "Like not found" }, 404);
    if (e === LikeError.UNAUTHORIZED) return c.json({ message: "Unauthorized" }, 403);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});