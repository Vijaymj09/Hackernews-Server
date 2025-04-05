import type { User } from "@prisma/client";

export type GetMeResult = {
  user: Omit<User, "password">;
};

export enum GetMeError {
  BAD_REQUEST,
}

export type GetAllUsersResult = {
  users: Omit<User, "password">[];
};

export enum GetAllUsersError {
  BAD_REQUEST,
}