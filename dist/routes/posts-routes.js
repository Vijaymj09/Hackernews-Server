"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRoutes = void 0;
const hono_1 = require("hono");
const posts_controller_js_1 = require("../controllers/posts/posts-controller.js");
const posts_types_js_1 = require("../controllers/posts/posts-types.js");
const token_middleware_js_1 = require("./middlewares/token-middleware.js");
exports.postsRoutes = new hono_1.Hono();
exports.postsRoutes.get("", async (c) => {
    const page = Number(c.req.query("page") || 1);
    const pageSize = Number(c.req.query("pageSize") || 10);
    const result = await (0, posts_controller_js_1.getAllPosts)({ page, pageSize });
    return c.json({ data: result }, 200);
});
exports.postsRoutes.get("/me", token_middleware_js_1.tokenMiddleware, async (c) => {
    const userId = c.get("userId");
    const page = Number(c.req.query("page") || 1);
    const pageSize = Number(c.req.query("pageSize") || 10);
    const result = await (0, posts_controller_js_1.getMyPosts)({ userId, page, pageSize });
    return c.json({ data: result }, 200);
});
exports.postsRoutes.post("", token_middleware_js_1.tokenMiddleware, async (c) => {
    const userId = c.get("userId");
    const { title, url } = await c.req.json();
    const result = await (0, posts_controller_js_1.createPost)({ userId, title, url });
    return c.json({ data: result }, 201);
});
exports.postsRoutes.delete("/:postId", token_middleware_js_1.tokenMiddleware, async (c) => {
    const userId = c.get("userId");
    const postId = c.req.param("postId");
    try {
        await (0, posts_controller_js_1.deletePost)({ userId, postId });
        return c.json({ message: "Post deleted" }, 200);
    }
    catch (e) {
        if (e === posts_types_js_1.PostError.NOT_FOUND)
            return c.json({ message: "Post not found" }, 404);
        if (e === posts_types_js_1.PostError.UNAUTHORIZED)
            return c.json({ message: "Unauthorized" }, 403);
        return c.json({ message: "Internal Server Error" }, 500);
    }
});
