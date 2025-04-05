import { prismaClient } from "../../extras/prisma.js";
import { GetMeError, type GetAllUsersResult, type GetMeResult } from "./users-types.js";

export const getMe = async (parameters: { userId: string }): Promise<GetMeResult> => {
  const user = await prismaClient.user.findUnique({
    where: { id: parameters.userId },
    select: { id: true, username: true, name: true, createdAt: true, updatedAt: true }
  });

  if (!user) throw GetMeError.BAD_REQUEST;

  return { user };
};

export const getAllUsers = async (parameters: {
  page: number;
  pageSize: number;
}): Promise<GetAllUsersResult> => {
  const users = await prismaClient.user.findMany({
    orderBy: { name: "asc" },
    skip: (parameters.page - 1) * parameters.pageSize,
    take: parameters.pageSize,
    select: { id: true, username: true, name: true, createdAt: true, updatedAt: true }
  });

  return { users };
};