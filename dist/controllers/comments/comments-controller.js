"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommentsOnUser = exports.GetCommentsOnMe = exports.GetCommentsOnPosts = exports.DeleteComment = exports.UpdateComment = exports.CreateComment = exports.GetComments = void 0;
const index_js_1 = require("../../integrations/prisma/index.js");
const comments_types_js_1 = require("./comments-types.js");
const GetComments = async (parameters) => {
    try {
        const { postId, page, limit } = parameters;
        if (page < 1 || limit < 1) {
            throw comments_types_js_1.GetCommentsError.PAGE_BEYOND_LIMIT;
        }
        const skip = (page - 1) * limit;
        const post = await index_js_1.prismaClient.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw comments_types_js_1.GetCommentsError.POST_NOT_FOUND;
        }
        const totalComments = await index_js_1.prismaClient.comment.count({
            where: { postId },
        });
        if (totalComments === 0) {
            throw comments_types_js_1.GetCommentsError.COMMENTS_NOT_FOUND;
        }
        const totalPages = Math.ceil(totalComments / limit);
        if (page > totalPages) {
            throw comments_types_js_1.GetCommentsError.PAGE_BEYOND_LIMIT;
        }
        const comments = await index_js_1.prismaClient.comment.findMany({
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
                },
            },
        });
        return { comments };
    }
    catch (e) {
        console.error(e);
        if (e === comments_types_js_1.GetCommentsError.POST_NOT_FOUND ||
            e === comments_types_js_1.GetCommentsError.COMMENTS_NOT_FOUND ||
            e === comments_types_js_1.GetCommentsError.PAGE_BEYOND_LIMIT) {
            throw e;
        }
        throw comments_types_js_1.GetCommentsError.UNKNOWN;
    }
};
exports.GetComments = GetComments;
const CreateComment = async (parameters) => {
    try {
        const { postId, userId, content } = parameters;
        if (!content.trim()) {
            throw comments_types_js_1.CreateCommentError.INVALID_INPUT;
        }
        const post = await index_js_1.prismaClient.post.findUnique({
            where: { id: postId },
            include: {
                author: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            },
        });
        if (!post) {
            throw comments_types_js_1.CreateCommentError.POST_NOT_FOUND;
        }
        const comment = await index_js_1.prismaClient.comment.create({
            data: {
                content,
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
        return { comment };
    }
    catch (e) {
        console.error(e);
        if (e === comments_types_js_1.CreateCommentError.POST_NOT_FOUND ||
            e === comments_types_js_1.CreateCommentError.INVALID_INPUT) {
            throw e;
        }
        throw comments_types_js_1.CreateCommentError.UNKNOWN;
    }
};
exports.CreateComment = CreateComment;
const UpdateComment = async (parameters) => {
    try {
        const { commentId, userId, content } = parameters;
        if (!content.trim()) {
            throw comments_types_js_1.UpdateCommentError.INVALID_INPUT;
        }
        const existingComment = await index_js_1.prismaClient.comment.findUnique({
            where: { id: commentId },
        });
        if (!existingComment) {
            throw comments_types_js_1.UpdateCommentError.COMMENT_NOT_FOUND;
        }
        if (existingComment.userId !== userId) {
            throw comments_types_js_1.UpdateCommentError.UNAUTHORIZED;
        }
        if (existingComment.content.toLowerCase().trim() ===
            content.toLowerCase().trim()) {
            throw comments_types_js_1.UpdateCommentError.NO_CHANGES;
        }
        const comment = await index_js_1.prismaClient.comment.update({
            where: { id: commentId },
            data: { content },
            include: {
                user: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            },
        });
        return { comment };
    }
    catch (e) {
        console.error(e);
        if (e === comments_types_js_1.UpdateCommentError.COMMENT_NOT_FOUND ||
            e === comments_types_js_1.UpdateCommentError.INVALID_INPUT ||
            e === comments_types_js_1.UpdateCommentError.NO_CHANGES ||
            e === comments_types_js_1.UpdateCommentError.UNAUTHORIZED) {
            throw e;
        }
        throw comments_types_js_1.UpdateCommentError.UNKNOWN;
    }
};
exports.UpdateComment = UpdateComment;
const DeleteComment = async (parameters) => {
    try {
        const { commentId, userId } = parameters;
        const comment = await index_js_1.prismaClient.comment.findUnique({
            where: { id: commentId },
        });
        if (!comment) {
            throw comments_types_js_1.DeleteCommentError.COMMENT_NOT_FOUND;
        }
        if (comment.userId !== userId) {
            throw comments_types_js_1.DeleteCommentError.UNAUTHORIZED;
        }
        await index_js_1.prismaClient.comment.delete({
            where: { id: commentId },
        });
    }
    catch (e) {
        console.error(e);
        if (e === comments_types_js_1.DeleteCommentError.COMMENT_NOT_FOUND ||
            e === comments_types_js_1.DeleteCommentError.UNAUTHORIZED) {
            throw e;
        }
        throw comments_types_js_1.DeleteCommentError.UNKNOWN;
    }
};
exports.DeleteComment = DeleteComment;
const GetCommentsOnPosts = async (parameters) => {
    try {
        const { page, limit } = parameters;
        if (page < 1 || limit < 1) {
            throw new Error("Page or limit is below 1");
        }
        const skip = (page - 1) * limit;
        const totalComments = await index_js_1.prismaClient.comment.count({
            where: { postId: { not: null } },
        });
        if (totalComments === 0) {
            throw new Error("No comments found");
        }
        const totalPages = Math.ceil(totalComments / limit);
        if (page > totalPages) {
            throw new Error("Page exceeds total pages");
        }
        const comments = await index_js_1.prismaClient.comment.findMany({
            where: { postId: { not: null } },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: {
                user: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            },
        });
        return { comments };
    }
    catch (e) {
        console.error(e);
        throw new Error(e instanceof Error ? e.message : "Unknown error");
    }
};
exports.GetCommentsOnPosts = GetCommentsOnPosts;
const GetCommentsOnMe = async (parameters) => {
    try {
        const { userId } = parameters;
        const user = await index_js_1.prismaClient.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
            },
        });
        if (!user) {
            throw comments_types_js_1.GetCommentsOnMeError.USER_NOT_FOUND;
        }
        const comments = await index_js_1.prismaClient.comment.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                post: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return { comments };
    }
    catch (e) {
        console.error(e);
        if (e === comments_types_js_1.GetCommentsOnMeError.COMMENTS_NOT_FOUND) {
            throw e;
        }
        if (e === comments_types_js_1.GetCommentsOnMeError.PAGE_BEYOND_LIMIT) {
            throw e;
        }
        if (e === comments_types_js_1.GetCommentsOnMeError.USER_NOT_FOUND) {
            throw e;
        }
        throw comments_types_js_1.GetCommentsOnMeError.UNKNOWN;
    }
};
exports.GetCommentsOnMe = GetCommentsOnMe;
const GetCommentsOnUser = async (parameters) => {
    try {
        const { username, page, limit } = parameters;
        const user = await index_js_1.prismaClient.user.findUnique({
            where: { username },
            select: {
                id: true,
            },
        });
        if (!user) {
            throw comments_types_js_1.GetCommentsOnUserError.USER_NOT_FOUND;
        }
        if (page < 1 || limit < 1) {
            throw new Error("Page or limit is below 1");
        }
        const skip = (page - 1) * limit;
        const totalComments = await index_js_1.prismaClient.comment.count({
            where: { userId: user.id },
        });
        if (totalComments === 0) {
            throw new Error("No comments found");
        }
        const totalPages = Math.ceil(totalComments / limit);
        if (page > totalPages) {
            throw new Error("Page exceeds total pages");
        }
        const comments = await index_js_1.prismaClient.comment.findMany({
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
        return { comments };
    }
    catch (e) {
        console.error(e);
        if (e === comments_types_js_1.GetCommentsOnUserError.COMMENTS_NOT_FOUND) {
            throw e;
        }
        if (e === comments_types_js_1.GetCommentsOnUserError.PAGE_BEYOND_LIMIT) {
            throw e;
        }
        if (e === comments_types_js_1.GetCommentsOnUserError.USER_NOT_FOUND) {
            throw e;
        }
        if (e === comments_types_js_1.GetCommentsOnUserError.POST_NOT_FOUND) {
            throw e;
        }
        throw comments_types_js_1.GetCommentsOnUserError.UNKNOWN;
    }
};
exports.GetCommentsOnUser = GetCommentsOnUser;
