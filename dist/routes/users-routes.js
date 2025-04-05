"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const hono_1 = require("hono");
const token_middleware_js_1 = require("./middlewares/token-middleware.js");
const users_types_js_1 = require("../controllers/users/users-types.js");
const users_controller_js_1 = require("../controllers/users/users-controller.js");
exports.usersRoutes = new hono_1.Hono();
exports.usersRoutes.get("/me", token_middleware_js_1.tokenMiddleware, async (context) => {
    const userId = context.get("userId");
    try {
        const user = await (0, users_controller_js_1.getMe)({ userId });
        return context.json({ data: user }, 200);
    }
    catch (e) {
        if (e === users_types_js_1.GetMeError.BAD_REQUEST) {
            return context.json({ error: "User not found" }, 400);
        }
        return context.json({ message: "Internal Server Error" }, 500);
    }
});
exports.usersRoutes.get("", token_middleware_js_1.tokenMiddleware, async (context) => {
    const page = Number(context.req.query("page") || 1);
    const pageSize = Number(context.req.query("pageSize") || 10);
    try {
        const users = await (0, users_controller_js_1.getAllUsers)({ page, pageSize });
        return context.json({ data: users }, 200);
    }
    catch (e) {
        return context.json({ message: "Internal Server Error" }, 500);
    }
});
