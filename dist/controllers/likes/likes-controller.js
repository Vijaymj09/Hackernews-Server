"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLikesOnUser = exports.GetLikesOnMe = exports.DeleteLike = exports.CreateLike = exports.GetLikes = void 0;
const index_js_1 = require("../../integrations/prisma/index.js");
const likes_types_js_1 = require("./likes-types.js");
const GetLikes = async (parameters) => {
    try {
        const { postId, page, limit } = parameters;
        const skip = (page - 1) * limit;
        const post = await index_js_1.prismaClient.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw likes_types_js_1.GetLikesError.POST_NOT_FOUND;
        }
        const totalLikes = await index_js_1.prismaClient.like.count({
            where: { postId },
        });
        if (totalLikes === 0) {
            return { likes: [] }; // instead of throwing
        }
        const totalPages = Math.ceil(totalLikes / limit);
        if (page > totalPages) {
            return { likes: [] };
        }
        const likes = await index_js_1.prismaClient.like.findMany({
            where: { postId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: {
                user: {
                    select: {
                        username: true,
                        name: true,
                    },
                }
            },
        });
        return { likes };
    }
    catch (e) {
        console.error(e);
        if (e === likes_types_js_1.GetLikesError.POST_NOT_FOUND ||
            e === likes_types_js_1.GetLikesError.LIKES_NOT_FOUND ||
            e === likes_types_js_1.GetLikesError.PAGE_NOT_FOUND) {
            throw e;
        }
        throw likes_types_js_1.GetLikesError.UNKNOWN;
    }
};
exports.GetLikes = GetLikes;
const CreateLike = async (parameters) => {
    try {
        const { postId, userId } = parameters;
        const post = await index_js_1.prismaClient.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw likes_types_js_1.LikePostError.POST_NOT_FOUND;
        }
        const user = await index_js_1.prismaClient.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        if (!user) {
            throw likes_types_js_1.LikePostError.USER_NOT_FOUND;
        }
        const existingLike = await index_js_1.prismaClient.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });
        if (existingLike) {
            throw likes_types_js_1.LikePostError.ALREADY_LIKED;
        }
        const like = await index_js_1.prismaClient.like.upsert({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
            update: {}, //this is to make sure that no updates are needed if like exists
            create: {
                postId,
                userId,
            },
            include: {
                user: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            },
        });
        return { message: "Liked Post!", like };
    }
    catch (e) {
        console.error(e);
        if (e === likes_types_js_1.LikePostError.POST_NOT_FOUND) {
            throw e;
        }
        if (e === likes_types_js_1.LikePostError.ALREADY_LIKED) {
            throw e;
        }
        if (e === likes_types_js_1.LikePostError.USER_NOT_FOUND) {
            throw e;
        }
        throw likes_types_js_1.LikePostError.UNKNOWN;
    }
};
exports.CreateLike = CreateLike;
const DeleteLike = async (parameters) => {
    try {
        const { postId, userId } = parameters;
        const post = await index_js_1.prismaClient.post.findUnique({
            where: { id: postId },
            include: {
                likes: true,
            },
        });
        if (!post) {
            throw likes_types_js_1.DeleteLikeError.POST_NOT_FOUND;
        }
        const like = await index_js_1.prismaClient.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });
        if (!like) {
            throw likes_types_js_1.DeleteLikeError.LIKE_NOT_FOUND;
        }
        if (like.userId !== userId) {
            throw likes_types_js_1.DeleteLikeError.USER_NOT_FOUND;
        }
        await index_js_1.prismaClient.like.delete({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });
        return { message: "Unliked Post!" };
    }
    catch (e) {
        console.error(e);
        if (e === likes_types_js_1.DeleteLikeError.POST_NOT_FOUND ||
            e === likes_types_js_1.DeleteLikeError.LIKE_NOT_FOUND ||
            e === likes_types_js_1.DeleteLikeError.USER_NOT_FOUND) {
            throw e;
        }
        throw likes_types_js_1.DeleteLikeError.UNKNOWN;
    }
};
exports.DeleteLike = DeleteLike;
const GetLikesOnMe = async (parameters) => {
    try {
        const { userId } = parameters;
        const user = await index_js_1.prismaClient.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
            },
        });
        if (!user) {
            throw likes_types_js_1.GetLikesOnMeError.USER_NOT_FOUND;
        }
        const likes = await index_js_1.prismaClient.like.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return { likes };
    }
    catch (e) {
        console.error(e);
        if (e === likes_types_js_1.GetLikesOnMeError.LIKES_NOT_FOUND) {
            throw e;
        }
        if (e === likes_types_js_1.GetLikesOnMeError.PAGE_NOT_FOUND) {
            throw e;
        }
        if (e === likes_types_js_1.GetLikesOnMeError.USER_NOT_FOUND) {
            throw e;
        }
        throw likes_types_js_1.GetLikesOnMeError.UNKNOWN;
    }
};
exports.GetLikesOnMe = GetLikesOnMe;
const GetLikesOnUser = async (parameters) => {
    try {
        const { username, page, limit } = parameters;
        if (page < 1 || limit < 1) {
            throw new Error("Page or limit is below 1");
        }
        const skip = (page - 1) * limit;
        const user = await index_js_1.prismaClient.user.findUnique({
            where: { username },
            select: {
                id: true,
            },
        });
        if (!user) {
            throw likes_types_js_1.GetLikesOnUserError.USER_NOT_FOUND;
        }
        const likes = await index_js_1.prismaClient.like.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: {
                post: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return { likes };
    }
    catch (e) {
        console.error(e);
        if (e === likes_types_js_1.GetLikesOnUserError.LIKES_NOT_FOUND) {
            throw e;
        }
        if (e === likes_types_js_1.GetLikesOnUserError.USER_NOT_FOUND) {
            throw e;
        }
        if (e === likes_types_js_1.GetLikesOnUserError.PAGE_NOT_FOUND) {
            throw e;
        }
        if (e === likes_types_js_1.GetLikesOnUserError.POST_NOT_FOUND) {
            throw e;
        }
        throw likes_types_js_1.GetLikesOnUserError.UNKNOWN;
    }
};
exports.GetLikesOnUser = GetLikesOnUser;
