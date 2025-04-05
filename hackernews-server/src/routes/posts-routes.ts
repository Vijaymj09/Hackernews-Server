import { Hono } from "hono";
import { getAllPosts, getMyPosts, createPost, deletePost } from "../controllers/posts/posts-controller.js";
import { PostError } from "../controllers/posts/posts-types.js";
import { tokenMiddleware } from "./middlewares/token-middleware.js";

export const postsRoutes = new Hono();

postsRoutes.get("", async (c) => {
  const page = Number(c.req.query("page") || 1);
  const pageSize = Number(c.req.query("pageSize") || 10);
  
  const result = await getAllPosts({ page, pageSize });
  return c.json({ data: result }, 200);
});

postsRoutes.get("/me", tokenMiddleware, async (c) => {
  const userId = c.get("userId");
  const page = Number(c.req.query("page") || 1);
  const pageSize = Number(c.req.query("pageSize") || 10);
  
  const result = await getMyPosts({ userId, page, pageSize });
  return c.json({ data: result }, 200);
});

postsRoutes.post("", tokenMiddleware, async (c) => {
  const userId = c.get("userId");
  const { title, url } = await c.req.json();
  
  const result = await createPost({ userId, title, url });
  return c.json({ data: result }, 201);
});

postsRoutes.delete("/:postId", tokenMiddleware, async (c) => {
  const userId = c.get("userId");
  const postId = c.req.param("postId");
  
  try {
    await deletePost({ userId, postId });
    return c.json({ message: "Post deleted" }, 200);
  } catch (e) {
    if (e === PostError.NOT_FOUND) return c.json({ message: "Post not found" }, 404);
    if (e === PostError.UNAUTHORIZED) return c.json({ message: "Unauthorized" }, 403);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});