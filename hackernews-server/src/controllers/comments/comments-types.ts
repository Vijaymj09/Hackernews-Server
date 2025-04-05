import type { Comment, User } from "@prisma/client";

export type GetCommentsResult = {
  comments: (Comment & { user: Pick<User, "username" | "name"> })[];
};

export type CreateCommentResult = {
  comment: Comment & { user: Pick<User, "username" | "name"> };
};

export type UpdateCommentResult = {
  comment: Comment & { user: Pick<User, "username" | "name"> };
};

export enum CommentError {
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  BAD_REQUEST = "BAD_REQUEST"
}