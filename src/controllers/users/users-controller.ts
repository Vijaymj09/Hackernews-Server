import { getPagination } from "../../extras/pagination";
import { prismaClient } from "../../integrations/prisma";

import {
  GetAllUsersError,
  GetMeError,

  type GetAllUsersResult,
  type GetMeResult,
} from "./users-types";

export const GetMe = async (parameters: {
  userId: string;
}): Promise<GetMeResult> => {
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: parameters.userId },
      select: {
        id: true,
        name: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        emailVerified: true,
        image: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        Comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            postId: true,
          },
        },
        Like: {
          select: {
            id: true,
            createdAt: true,
            postId: true,
          },
        },
      },
    });


    if (!user) {
      throw GetMeError.USER_NOT_FOUND;
    }

    return { user };
  } catch (e) {
    console.error(e);
    throw GetMeError.UNKNOWN;
  }
};

export const GetUsers = async (parameter: {
  page: number;
  limit: number;
}): Promise<GetAllUsersResult> => {
  try {
    const { skip, take } = getPagination(parameter.page, parameter.limit);

    const users = await prismaClient.user.findMany({
      orderBy: { name: "asc" },
      skip,
      take,
      select: {
        id: true,
        name: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        emailVerified: true,
        image: true,
      },
    });

    if (!users || users.length === 0) {
      throw GetAllUsersError.NO_USERS_FOUND;
    }

    return { users };
  } catch (e) {
    console.error(e);
    throw GetAllUsersError.UNKNOWN;
  }
};



interface GetUserByIdProps {
  userId: string;
}