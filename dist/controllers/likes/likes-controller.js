"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLike = exports.createLike = exports.getLikes = void 0;
const prisma_js_1 = require("../../extras/prisma.js");
const likes_types_js_1 = require("./likes-types.js");
const getLikes = async (parameters) => {
    const likes = await prisma_js_1.prismaClient.like.findMany({
        where: { postId: parameters.postId },
        orderBy: { createdAt: "desc" },
        skip: (parameters.page - 1) * parameters.pageSize,
        take: parameters.pageSize,
        include: { user: { select: { username: true, name: true } } }
    });
    return { likes };
};
exports.getLikes = getLikes;
const createLike = async (parameters) => {
    const existingLike = await prisma_js_1.prismaClient.like.findUnique({
        where: { userId_postId: { userId: parameters.userId, postId: parameters.postId } },
        include: { user: { select: { username: true, name: true } } }
    });
    if (existingLike)
        return { like: existingLike };
    const like = await prisma_js_1.prismaClient.like.create({
        data: {
            userId: parameters.userId,
            postId: parameters.postId
        },
        include: { user: { select: { username: true, name: true } } }
    });
    return { like };
};
exports.createLike = createLike;
const deleteLike = async (parameters) => {
    const like = await prisma_js_1.prismaClient.like.findUnique({
        where: { userId_postId: { userId: parameters.userId, postId: parameters.postId } }
    });
    if (!like)
        throw likes_types_js_1.LikeError.NOT_FOUND;
    if (like.userId !== parameters.userId)
        throw likes_types_js_1.LikeError.UNAUTHORIZED;
    await prisma_js_1.prismaClient.like.delete({
        where: { userId_postId: { userId: parameters.userId, postId: parameters.postId } }
    });
};
exports.deleteLike = deleteLike;
