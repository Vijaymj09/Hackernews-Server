"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRoutes = void 0;
const hono_1 = require("hono");
const comments_controller_js_1 = require("../controllers/comments/comments-controller.js");
const comments_types_js_1 = require("../controllers/comments/comments-types.js");
const token_middleware_js_1 = require("./middlewares/token-middleware.js");
exports.commentsRoutes = new hono_1.Hono();
exports.commentsRoutes.get("/on/:postId", async (c) => {
    const postId = c.req.param("postId");
    const page = Number(c.req.query("page") || 1);
    const pageSize = Number(c.req.query("pageSize") || 10);
    const result = await (0, comments_controller_js_1.getComments)({ postId, page, pageSize });
    return c.json({ data: result }, 200);
});
exports.commentsRoutes.post("/on/:postId", token_middleware_js_1.tokenMiddleware, async (c) => {
    const userId = c.get("userId");
    const postId = c.req.param("postId");
    const { text } = await c.req.json();
    const result = await (0, comments_controller_js_1.createComment)({ userId, postId, text });
    return c.json({ data: result }, 201);
});
exports.commentsRoutes.delete("/:commentId", token_middleware_js_1.tokenMiddleware, async (c) => {
    const userId = c.get("userId");
    const commentId = c.req.param("commentId");
    try {
        await (0, comments_controller_js_1.deleteComment)({ userId, commentId });
        return c.json({ message: "Comment deleted" }, 200);
    }
    catch (e) {
        if (e === comments_types_js_1.CommentError.NOT_FOUND)
            return c.json({ message: "Comment not found" }, 404);
        if (e === comments_types_js_1.CommentError.UNAUTHORIZED)
            return c.json({ message: "Unauthorized" }, 403);
        return c.json({ message: "Internal Server Error" }, 500);
    }
});
exports.commentsRoutes.patch("/:commentId", token_middleware_js_1.tokenMiddleware, async (c) => {
    const userId = c.get("userId");
    const commentId = c.req.param("commentId");
    const { text } = await c.req.json();
    try {
        const result = await (0, comments_controller_js_1.updateComment)({ userId, commentId, text });
        return c.json({ data: result }, 200);
    }
    catch (e) {
        if (e === comments_types_js_1.CommentError.NOT_FOUND)
            return c.json({ message: "Comment not found" }, 404);
        if (e === comments_types_js_1.CommentError.UNAUTHORIZED)
            return c.json({ message: "Unauthorized" }, 403);
        return c.json({ message: "Internal Server Error" }, 500);
    }
});
