import { betterAuth } from "better-auth";

import { prismaAdapter } from "better-auth/adapters/prisma";
import { username } from "better-auth/plugins";
import { prismaClient } from "../prisma";
import { betterAuthSecret, serverUrl, webClientUrl } from "../../environment";

const betterAuthServerClient = betterAuth({
  baseURL: serverUrl,
  trustedOrigins: [webClientUrl],
  secret: betterAuthSecret,
  plugins: [username()],
  database: prismaAdapter(prismaClient, {
    provider: "postgresql",
  }),
  user: {
    modelName: "User",
  },
  session: {
    modelName: "Session",

    // ✅ Add cookie config here
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  account: {
    modelName: "Account",
  },
  verification: {
    modelName: "Verification",
  },
  emailAndPassword: {
    enabled: true,
  },
  cookieCache: {
    enabled: true,
    maxAge: 300,
  },
});


export default betterAuthServerClient;