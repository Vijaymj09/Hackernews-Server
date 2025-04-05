import type { Like, User } from "@prisma/client";

export type GetLikesResult = {
  likes: (Like & { user: Pick<User, "username" | "name"> })[];
};

export type CreateLikeResult = {
  like: Like & { user: Pick<User, "username" | "name"> };
};

export enum LikeError {
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  BAD_REQUEST = "BAD_REQUEST"
}