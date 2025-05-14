"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likesRoutes = void 0;
const hono_1 = require("hono");
const session_middleware_js_1 = require("./middlewares/session-middleware.js");
const likes_types_js_1 = require("../controllers/likes/likes-types.js");
const pagination_js_1 = require("../extras/pagination.js");
const likes_controller_js_1 = require("../controllers/likes/likes-controller.js");
exports.likesRoutes = new hono_1.Hono();
exports.likesRoutes.get("/on/:postId", async (c) => {
    try {
        const postId = c.req.param("postId");
        const { page, limit } = (0, pagination_js_1.getPagination)(c);
        const result = await (0, likes_controller_js_1.GetLikes)({ postId, page, limit });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === likes_types_js_1.GetLikesError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found" }, 404);
        }
        if (error === likes_types_js_1.GetLikesError.LIKES_NOT_FOUND) {
            return c.json({ error: "No likes found on this post" }, 404);
        }
        if (error === likes_types_js_1.GetLikesError.PAGE_NOT_FOUND) {
            return c.json({ error: "No likes found on the requested page" }, 404);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
// likesRoutes.get("/on/:postId", sessionMiddleware, async (c) => {
//   try {
//     const postId = c.req.param("postId");
//     const { page, limit } = getPagination(c);
//     const userId = c.get("user")?.id; // Get logged in user ID
//     const result = await GetLikes({ postId, page, limit });
//     const likedByCurrentUser = result.likes.some((like: any) => like.userId === userId);
//     return c.json(
//       {
//         likes: result.likes,
//         likedByCurrentUser, // <-- return true/false
//       },
//       200
//     );
//   } catch (error) {
//     if (error === GetLikesError.POST_NOT_FOUND) {
//       return c.json({ error: "Post not found" }, 404);
//     }
//     if (error === GetLikesError.LIKES_NOT_FOUND) {
//       return c.json({ error: "No likes found on this post" }, 404);
//     }
//     if (error === GetLikesError.PAGE_NOT_FOUND) {
//       return c.json({ error: "No likes found on the requested page" }, 404);
//     }
//     return c.json({ error: "Unknown error" }, 500);
//   }
// });
exports.likesRoutes.post("/on/:postId", session_middleware_js_1.sessionMiddleware, async (c) => {
    try {
        const postId = c.req.param("postId");
        const userId = c.get("user").id;
        const result = await (0, likes_controller_js_1.CreateLike)({ postId, userId });
        return c.json(result, 201);
    }
    catch (error) {
        if (error === likes_types_js_1.LikePostError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found" }, 404);
        }
        if (error === likes_types_js_1.LikePostError.ALREADY_LIKED) {
            return c.json({ error: "You have already liked this post" }, 400);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.likesRoutes.delete("/on/:postId", session_middleware_js_1.sessionMiddleware, async (c) => {
    try {
        const postId = c.req.param("postId");
        const userId = c.get("user").id;
        const result = await (0, likes_controller_js_1.DeleteLike)({ postId, userId });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === likes_types_js_1.DeleteLikeError.POST_NOT_FOUND) {
            return c.json({ error: "Post not found" }, 404);
        }
        if (error === likes_types_js_1.DeleteLikeError.LIKE_NOT_FOUND) {
            return c.json({ error: "Like not found" }, 404);
        }
        if (error === likes_types_js_1.DeleteLikeError.USER_NOT_FOUND) {
            return c.json({ error: "You can only remove your own likes" }, 403);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.likesRoutes.get("/me", session_middleware_js_1.sessionMiddleware, async (c) => {
    try {
        const userId = c.get("user")?.id;
        const result = await (0, likes_controller_js_1.GetLikesOnMe)({ userId });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === likes_types_js_1.GetLikesOnMeError.LIKES_NOT_FOUND) {
            return c.json({ error: "No likes found" }, 404);
        }
        if (error === likes_types_js_1.GetLikesOnMeError.PAGE_NOT_FOUND) {
            return c.json({ error: "No likes found on the requested page" }, 404);
        }
        if (error === likes_types_js_1.GetLikesOnMeError.USER_NOT_FOUND) {
            return c.json({ error: "User not found" }, 404);
        }
        return c.json({ error: "Unknown error" }, 500);
    }
});
exports.likesRoutes.get("/by/:slug", async (c) => {
    try {
        const { slug } = c.req.param();
        const { page, limit } = (0, pagination_js_1.getPagination)(c);
        const result = await (0, likes_controller_js_1.GetLikesOnUser)({ username: slug, page, limit });
        return c.json(result, 200);
    }
    catch (error) {
        if (error === likes_types_js_1.GetLikesOnMeError.LIKES_NOT_FOUND) {
            return c.json({ error: "No likes found for this user" }, 404);
        }
        if (error === likes_types_js_1.GetLikesOnUserError.USER_NOT_FOUND) {
            return c.json({ error: "User not found" }, 404);
        }
        if (error === likes_types_js_1.GetLikesOnUserError.PAGE_NOT_FOUND) {
            return c.json({ error: "No likes found on the requested page" }, 404);
        }
        if (error === likes_types_js_1.GetLikesOnUserError.POST_NOT_FOUND) {
            return c.json({ error: "No likes found on the requested page" }, 404);
        }
        return c.json({ error: "Unknown error!" }, 500);
    }
});
