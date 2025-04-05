import { Hono } from "hono";
import { getComments, createComment, deleteComment, updateComment } from "../controllers/comments/comments-controller.js";
import { CommentError } from "../controllers/comments/comments-types.js";
import { tokenMiddleware } from "./middlewares/token-middleware.js";


export const commentsRoutes = new Hono();

commentsRoutes.get("/on/:postId", async (c) => {
  const postId = c.req.param("postId");
  const page = Number(c.req.query("page") || 1);
  const pageSize = Number(c.req.query("pageSize") || 10);
  
  const result = await getComments({ postId, page, pageSize });
  return c.json({ data: result }, 200);
});

commentsRoutes.post("/on/:postId", tokenMiddleware, async (c) => {
  const userId = c.get("userId");
  const postId = c.req.param("postId");
  const { text } = await c.req.json();
  
  const result = await createComment({ userId, postId, text });
  return c.json({ data: result }, 201);
});

commentsRoutes.delete("/:commentId", tokenMiddleware, async (c) => {
  const userId = c.get("userId");
  const commentId = c.req.param("commentId");
  
  try {
    await deleteComment({ userId, commentId });
    return c.json({ message: "Comment deleted" }, 200);
  } catch (e) {
    if (e === CommentError.NOT_FOUND) return c.json({ message: "Comment not found" }, 404);
    if (e === CommentError.UNAUTHORIZED) return c.json({ message: "Unauthorized" }, 403);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

commentsRoutes.patch("/:commentId", tokenMiddleware, async (c) => {
  const userId = c.get("userId");
  const commentId = c.req.param("commentId");
  const { text } = await c.req.json();
  
  try {
    const result = await updateComment({ userId, commentId, text });
    return c.json({ data: result }, 200);
  } catch (e) {
    if (e === CommentError.NOT_FOUND) return c.json({ message: "Comment not found" }, 404);
    if (e === CommentError.UNAUTHORIZED) return c.json({ message: "Unauthorized" }, 403);
    return c.json({ message: "Internal Server Error" }, 500);
  }
});