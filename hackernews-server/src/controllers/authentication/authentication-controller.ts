import { createHash } from "crypto";
import { sign } from "jsonwebtoken";
import { jwtSecretKey } from "../../environment.js";
import { prismaClient } from "../../extras/prisma.js";
import { type SignUpWithUsernameAndPasswordResult, SignUpWithUsernameAndPasswordError, type LogInWithUsernameAndPasswordResult, LogInWtihUsernameAndPasswordError } from "./authentication-types.js";


export const signUpWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
  name?: string;
}): Promise<SignUpWithUsernameAndPasswordResult> => {
  // Check if user already exists
  const isUserExistingAlready = await checkIfUserExistsAlready({
    username: parameters.username,
  });

  if (isUserExistingAlready) {
    throw SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
  }

  // Create password hash
  const passwordHash = await createPasswordHash({
    password: parameters.password,
  });

  // Create new user
  const user = await prismaClient.user.create({
    data: {
      username: parameters.username,
      password: passwordHash,
      name: parameters.name,
    },
  });

  // Generate JWT token
  const token = createJWToken({
    id: user.id,
    username: user.username,
  });

  return {
    token,
    user,
  };
};

export const logInWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
}): Promise<LogInWithUsernameAndPasswordResult> => {
  // Create password hash
  const passwordHash = createPasswordHash({
    password: parameters.password,
  });

  // Find user
  const user = await prismaClient.user.findUnique({
    where: {
      username: parameters.username,
      password: passwordHash,
    },
  });

  if (!user) {
    throw LogInWtihUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
  }

  // Generate JWT token
  const token = createJWToken({
    id: user.id,
    username: user.username,
  });

  return {
    token,
    user,
  };
};

const createJWToken = (parameters: { id: string; username: string }): string => {
  const jwtPayload: { iss: string; sub: string; username: string } = {
    iss: "hackernews-server",
    sub: parameters.id,
    username: parameters.username,
  };

  return sign(jwtPayload, jwtSecretKey, {
    expiresIn: "30d",
  });
};

const checkIfUserExistsAlready = async (parameters: { username: string }): Promise<boolean> => {
  const existingUser = await prismaClient.user.findUnique({
    where: {
      username: parameters.username,
    },
  });

  return !!existingUser;
};

const createPasswordHash = (parameters: { password: string }): string => {
  return createHash("sha256").update(parameters.password).digest("hex");
};