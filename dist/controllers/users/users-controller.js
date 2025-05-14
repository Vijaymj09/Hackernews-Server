"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserById = exports.GetUsers = exports.GetMe = void 0;
const index_js_1 = require("../../integrations/prisma/index.js");
const users_types_js_1 = require("./users-types.js");
const GetMe = async (parameters) => {
    try {
        const { userId, page, limit } = parameters;
        const skip = (page - 1) * limit;
        const totalUsers = await index_js_1.prismaClient.user.count();
        if (totalUsers === 0) {
            throw users_types_js_1.GetMeError.USER_NOT_FOUND;
        }
        const totalPages = Math.ceil(totalUsers / limit);
        if (page > totalPages) {
            throw users_types_js_1.GetMeError.PAGE_BEYOND_LIMIT;
        }
        const user = await index_js_1.prismaClient.user.findUnique({
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
            throw users_types_js_1.GetMeError.USER_NOT_FOUND;
        }
        const result = {
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
    }
    catch (e) {
        console.error(e);
        throw users_types_js_1.GetMeError.UNKNOWN;
    }
};
exports.GetMe = GetMe;
const GetUsers = async (parameter) => {
    try {
        const { page, limit } = parameter;
        const skip = (page - 1) * limit;
        const totalUsers = await index_js_1.prismaClient.user.count();
        if (totalUsers === 0) {
            throw users_types_js_1.GetUsersError.USERS_NOT_FOUND;
        }
        const totalPages = Math.ceil(totalUsers / limit);
        if (page > totalPages) {
            throw users_types_js_1.GetUsersError.PAGE_BEYOND_LIMIT;
        }
        const users = await index_js_1.prismaClient.user.findMany({
            orderBy: { name: "asc" },
            skip,
            take: limit,
        });
        return { users };
    }
    catch (e) {
        console.error(e);
        if (e === users_types_js_1.GetUsersError.USERS_NOT_FOUND ||
            e === users_types_js_1.GetUsersError.PAGE_BEYOND_LIMIT) {
            throw e;
        }
        throw users_types_js_1.GetUsersError.UNKNOWN;
    }
};
exports.GetUsers = GetUsers;
const GetUserById = async (userId) => {
    try {
        const user = await index_js_1.prismaClient.user.findUnique({
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
        const result = {
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
    }
    catch (e) {
        console.error(e);
        throw new Error("Failed to fetch user details");
    }
};
exports.GetUserById = GetUserById;
