"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const hono_1 = require("hono");
const users_types_js_1 = require("../controllers/users/users-types.js");
const index_js_1 = require("../integrations/prisma/index.js");
const session_middleware_js_1 = require("./middlewares/session-middleware.js");
const pagination_js_1 = require("../extras/pagination.js");
const users_controller_js_1 = require("../controllers/users/users-controller.js");
exports.usersRoutes = new hono_1.Hono();
exports.usersRoutes.all("/me", session_middleware_js_1.sessionMiddleware, async (context) => {
    const user = context.get("user");
    const userId = user?.id;
    if (!userId) {
        return context.json({ error: "User not found" }, 404);
    }
    if (context.req.method === "GET") {
        // Existing GET method to fetch user profile
        try {
            const { page, limit } = (0, pagination_js_1.getPagination)(context);
            const result = await (0, users_controller_js_1.GetMe)({ userId, page, limit });
            if (!result) {
                return context.json({ error: "User not found" }, 404);
            }
            return context.json(result, 200);
        }
        catch (error) {
            if (error === users_types_js_1.GetMeError.USER_NOT_FOUND) {
                return context.json({ error: "User not found" }, 404);
            }
            if (error === users_types_js_1.GetMeError.UNKNOWN) {
                return context.json({ error: "Unknown error" }, 500);
            }
        }
    }
    else if (context.req.method === "POST") {
        // New POST method to update "About" field
        try {
            const { about } = await context.req.json();
            if (!about) {
                return context.json({ error: "About field is required" }, 400);
            }
            // Update the 'about' field in the database
            const updatedUser = await index_js_1.prismaClient.user.update({
                where: { id: userId },
                data: { about },
            });
            return context.json({ user: updatedUser }, 200);
        }
        catch (error) {
            console.error("Error updating About:", error);
            return context.json({ error: "Failed to update About" }, 500);
        }
    }
});
exports.usersRoutes.get("/", session_middleware_js_1.sessionMiddleware, async (context) => {
    try {
        const { page, limit } = (0, pagination_js_1.getPagination)(context);
        const result = await (0, users_controller_js_1.GetUsers)({ page, limit });
        if (!result) {
            return context.json({ error: "No users found" }, 404);
        }
        return context.json(result, 200);
    }
    catch (error) {
        if (error === users_types_js_1.GetUsersError.USERS_NOT_FOUND) {
            return context.json({ error: "No users found" }, 404);
        }
        if (error === users_types_js_1.GetUsersError.PAGE_BEYOND_LIMIT) {
            return context.json({ error: "No users found on the page requested" }, 404);
        }
        if (error === users_types_js_1.GetUsersError.UNKNOWN) {
            return context.json({ error: "Unknown error" }, 500);
        }
    }
});
exports.usersRoutes.get("/:id", session_middleware_js_1.sessionMiddleware, async (context) => {
    const userId = context.req.param("id"); // Get userId from URL params
    try {
        const result = await (0, users_controller_js_1.GetUserById)(userId); // Use the GetUserById function to get the user's data
        if (!result) {
            return context.json({ error: "User not found" }, 404);
        }
        return context.json(result, 200);
    }
    catch (error) {
        return context.json("Unknown error", 500);
    }
});
