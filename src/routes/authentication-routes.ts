import { Hono } from "hono";
import { signUpWithUsernameAndPassword, logInWithUsernameAndPassword } from "../controllers/authentication/authentication-controller.js";
import { SignUpWithUsernameAndPasswordError, LogInWtihUsernameAndPasswordError } from "../controllers/authentication/authentication-types.js";


export const authenticationRoutes = new Hono();

// Sign-up endpoint (POST instead of GET as per REST conventions)
authenticationRoutes.post("/sign-up", async (context) => {
  try {
    const { username, password, name } = await context.req.json();

    if (!username || !password) {
      return context.json(
        {
          message: "Username and password are required",
        },
        400
      );
    }

    const result = await signUpWithUsernameAndPassword({
      username,
      password,
      name,
    });

    return context.json(
      {
        data: {
          token: result.token,
          user: {
            id: result.user.id,
            username: result.user.username,
            name: result.user.name,
          },
        },
      },
      201
    );
  } catch (e) {
    if (e === SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
      return context.json(
        {
          message: "Username already exists",
        },
        409
      );
    }

    console.error("Sign-up error:", e);
    return context.json(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
});

// Log-in endpoint (POST instead of GET as per REST conventions)
authenticationRoutes.post("/log-in", async (context) => {
  try {
    const { username, password } = await context.req.json();

    if (!username || !password) {
      return context.json(
        {
          message: "Username and password are required",
        },
        400
      );
    }

    const result = await logInWithUsernameAndPassword({
      username,
      password,
    });

    return context.json(
      {
        data: {
          token: result.token,
          user: {
            id: result.user.id,
            username: result.user.username,
            name: result.user.name,
          },
        },
      },
      200
    );
  } catch (e) {
    if (e === LogInWtihUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD) {
      return context.json(
        {
          message: "Incorrect username or password",
        },
        401
      );
    }

    console.error("Log-in error:", e);
    return context.json(
      {
        message: "Internal Server Error",
      },
      500
    );
  }
});