import { Hono } from "hono";
import { tokenMiddleware } from "./middlewares/token-middleware.js";
import { GetMeError } from "../controllers/users/users-types.js";
import { getAllUsers, getMe } from "../controllers/users/users-controller.js";


export const usersRoutes = new Hono();

usersRoutes.get("/me", tokenMiddleware, async (context) => {
  const userId = context.get("userId");

  try {
    const user = await getMe({ userId });
    return context.json({ data: user }, 200);
  } catch (e) {
    if (e === GetMeError.BAD_REQUEST) {
      return context.json({ error: "User not found" }, 400);
    }
    return context.json({ message: "Internal Server Error" }, 500);
  }
});

usersRoutes.get("", tokenMiddleware, async (context) => {
  const page = Number(context.req.query("page") || 1);
  const pageSize = Number(context.req.query("pageSize") || 10);

  try {
    const users = await getAllUsers({ page, pageSize });
    return context.json({ data: users }, 200);
  } catch (e) {
    return context.json({ message: "Internal Server Error" }, 500);
  }
});