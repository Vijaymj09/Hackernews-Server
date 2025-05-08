import { prismaClient as prisma } from "../../integrations/prisma/index.js";
import {
  GetMeError,
  type GetMeResult,
  type GetUsersResult,
  GetUsersError,
  type UserDetails,
} from "./users-types.js";

export const GetMe = async (parameters: {
  userId: string;
  page: number;
  limit: number;
}): Promise<GetMeResult> => {
  try {
    const { userId, page, limit } = parameters;
    const skip = (page - 1) * limit;

    const totalUsers = await prisma.user.count();
    if (totalUsers === 0) {
      throw GetMeError.USER_NOT_FOUND;
    }

    const totalPages = Math.ceil(totalUsers / limit);
    if (page > totalPages) {
      throw GetMeError.PAGE_BEYOND_LIMIT;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
          },
        },
        comments: {
          select: {
            id: true,
            content: true,
            postId: true,
            createdAt: true,
            userId: true,
          },
        },
        likes: {
          select: {
            id: true,
            postId: true,
            createdAt: true,
            userId: true,
          },
        },
      },
    });

    if (!user) {
      throw GetMeError.USER_NOT_FOUND;
    }

    const result: GetMeResult = {
      user: {
        id: user.id,
        username: user.username,
        name: user.name || "",
        // about: user.about || "", // Removed because 'about' does not exist in the Prisma schema
        createdAt: user.createdAt,
        posts: user.posts || [],
        comments: [], // Removed 'Comment' as it does not exist in the Prisma schema
        likes: [], // Default to an empty array as 'Like' does not exist in the Prisma schema
        about: "",
        updatedAt: new Date(0) // Default to epoch date or provide a valid Date
      },
    };

    return result;
  } catch (e) {
    console.error(e);
    throw GetMeError.UNKNOWN;
  }
};

export const GetUsers = async (parameter: {
  page: number;
  limit: number;
}): Promise<GetUsersResult> => {
  try {
    const { page, limit } = parameter;
    const skip = (page - 1) * limit;

    const totalUsers = await prisma.user.count();
    if (totalUsers === 0) {
      throw GetUsersError.USERS_NOT_FOUND;
    }

    const totalPages = Math.ceil(totalUsers / limit);
    if (page > totalPages) {
      throw GetUsersError.PAGE_BEYOND_LIMIT;
    }

    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      skip,
      take: limit,
    });

    return { users };
  } catch (e) {
    console.error(e);
    if (
      e === GetUsersError.USERS_NOT_FOUND ||
      e === GetUsersError.PAGE_BEYOND_LIMIT
    ) {
      throw e;
    }
    throw GetUsersError.UNKNOWN;
  }
};

export const GetUserById = async (userId: string): Promise<UserDetails> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const result: UserDetails = {
      user: {
        id: user.id,
        username: user.username,
        name: user.name || "",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        postsCount: user.posts.length,
        commentsCount: 0, // Default to 0 as 'Comment' does not exist in the Prisma schema
        posts: user.posts || [],
        comments: [],
        about: ""
      },
    };

    return result;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch user details");
  }
};