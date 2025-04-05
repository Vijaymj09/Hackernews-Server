import type { Post, User } from "@prisma/client";

export type GetAllPostsResult = {
  posts: (Post & { user: Pick<User, "username" | "name"> })[];
};

export type GetMyPostsResult = {
  posts: (Post & { user: Pick<User, "username" | "name"> })[];
};

export type CreatePostResult = {
  post: Post & { user: Pick<User, "username" | "name"> };
};

export enum PostError {
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  BAD_REQUEST = "BAD_REQUEST"
};