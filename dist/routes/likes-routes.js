"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likesRoutes = void 0;
const hono_1 = require("hono");
const likes_controller_js_1 = require("../controllers/likes/likes-controller.js");
const likes_types_js_1 = require("../controllers/likes/likes-types.js");
const token_middleware_js_1 = require("./middlewares/token-middleware.js");
exports.likesRoutes = new hono_1.Hono();
exports.likesRoutes.get("/on/:postId", async (c) => {
    const postId = c.req.param("postId");
    const page = Number(c.req.query("page") || 1);
    const pageSize = Number(c.req.query("pageSize") || 10);
    const result = await (0, likes_controller_js_1.getLikes)({ postId, page, pageSize });
    return c.json({ data: result }, 200);
});
exports.likesRoutes.post("/on/:postId", token_middleware_js_1.tokenMiddleware, async (c) => {
    const userId = c.get("userId");
    const postId = c.req.param("postId");
    const result = await (0, likes_controller_js_1.createLike)({ userId, postId });
    return c.json({ data: result }, 201);
});
exports.likesRoutes.delete("/on/:postId", token_middleware_js_1.tokenMiddleware, async (c) => {
    const userId = c.get("userId");
    const postId = c.req.param("postId");
    try {
        await (0, likes_controller_js_1.deleteLike)({ userId, postId });
        return c.json({ message: "Like deleted" }, 200);
    }
    catch (e) {
        if (e === likes_types_js_1.LikeError.NOT_FOUND)
            return c.json({ message: "Like not found" }, 404);
        if (e === likes_types_js_1.LikeError.UNAUTHORIZED)
            return c.json({ message: "Unauthorized" }, 403);
        return c.json({ message: "Internal Server Error" }, 500);
    }
});
