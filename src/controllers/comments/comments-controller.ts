import { prismaClient } from "../../extras/prisma.js";
import { CommentError, type CreateCommentResult, type GetCommentsResult, type UpdateCommentResult } from "./comments-types.js";


export const getComments = async (parameters: {
  postId: string;
  page: number;
  pageSize: number;
}): Promise<GetCommentsResult> => {
  const comments = await prismaClient.comment.findMany({
    where: { postId: parameters.postId },
    orderBy: { createdAt: "desc" },
    skip: (parameters.page - 1) * parameters.pageSize,
    take: parameters.pageSize,
    include: { user: { select: { username: true, name: true } } }
  });

  return { comments };
};

export const createComment = async (parameters: {
  userId: string;
  postId: string;
  text: string;
}): Promise<CreateCommentResult> => {
  const comment = await prismaClient.comment.create({
    data: {
      text: parameters.text,
      userId: parameters.userId,
      postId: parameters.postId
    },
    include: { user: { select: { username: true, name: true } } }
  });

  return { comment };
};

export const updateComment = async (parameters: {
  userId: string;
  commentId: string;
  text: string;
}): Promise<UpdateCommentResult> => {
  const comment = await prismaClient.comment.findUnique({
    where: { id: parameters.commentId }
  });

  if (!comment) throw CommentError.NOT_FOUND;
  if (comment.userId !== parameters.userId) throw CommentError.UNAUTHORIZED;

  const updatedComment = await prismaClient.comment.update({
    where: { id: parameters.commentId },
    data: { text: parameters.text },
    include: { user: { select: { username: true, name: true } } }
  });

  return { comment: updatedComment };
};

export const deleteComment = async (parameters: {
  userId: string;
  commentId: string;
}): Promise<void> => {
  const comment = await prismaClient.comment.findUnique({
    where: { id: parameters.commentId }
  });

  if (!comment) throw CommentError.NOT_FOUND;
  if (comment.userId !== parameters.userId) throw CommentError.UNAUTHORIZED;

  await prismaClient.comment.delete({
    where: { id: parameters.commentId }
  });
};