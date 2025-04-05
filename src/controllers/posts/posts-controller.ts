import { prismaClient } from "../../extras/prisma.js";
import { PostError, type CreatePostResult, type GetAllPostsResult, type GetMyPostsResult } from "./posts-types.js";

export const getAllPosts = async (parameters: {
  page: number;
  pageSize: number;
}): Promise<GetAllPostsResult> => {
  const posts = await prismaClient.post.findMany({
    orderBy: { createdAt: "desc" },
    skip: (parameters.page - 1) * parameters.pageSize,
    take: parameters.pageSize,
    include: { user: { select: { username: true, name: true } } }
  });

  return { posts };
};

export const getMyPosts = async (parameters: {
  userId: string;
  page: number;
  pageSize: number;
}): Promise<GetMyPostsResult> => {
  const posts = await prismaClient.post.findMany({
    where: { userId: parameters.userId },
    orderBy: { createdAt: "desc" },
    skip: (parameters.page - 1) * parameters.pageSize,
    take: parameters.pageSize,
    include: { user: { select: { username: true, name: true } } }
  });

  return { posts };
};

export const createPost = async (parameters: {
  userId: string;
  title: string;
  url?: string;
}): Promise<CreatePostResult> => {
  const post = await prismaClient.post.create({
    data: {
      title: parameters.title,
      url: parameters.url,
      userId: parameters.userId
    },
    include: { user: { select: { username: true, name: true } } }
  });

  return { post };
};

export const deletePost = async (parameters: {
  userId: string;
  postId: string;
}): Promise<void> => {
  const post = await prismaClient.post.findUnique({
    where: { id: parameters.postId }
  });

  if (!post) throw PostError.NOT_FOUND;
  if (post.userId !== parameters.userId) throw PostError.UNAUTHORIZED;

  await prismaClient.post.delete({
    where: { id: parameters.postId }
  });
};