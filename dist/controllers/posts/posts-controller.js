"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.createPost = exports.getMyPosts = exports.getAllPosts = void 0;
const prisma_js_1 = require("../../extras/prisma.js");
const posts_types_js_1 = require("./posts-types.js");
const getAllPosts = async (parameters) => {
    const posts = await prisma_js_1.prismaClient.post.findMany({
        orderBy: { createdAt: "desc" },
        skip: (parameters.page - 1) * parameters.pageSize,
        take: parameters.pageSize,
        include: { user: { select: { username: true, name: true } } }
    });
    return { posts };
};
exports.getAllPosts = getAllPosts;
const getMyPosts = async (parameters) => {
    const posts = await prisma_js_1.prismaClient.post.findMany({
        where: { userId: parameters.userId },
        orderBy: { createdAt: "desc" },
        skip: (parameters.page - 1) * parameters.pageSize,
        take: parameters.pageSize,
        include: { user: { select: { username: true, name: true } } }
    });
    return { posts };
};
exports.getMyPosts = getMyPosts;
const createPost = async (parameters) => {
    const post = await prisma_js_1.prismaClient.post.create({
        data: {
            title: parameters.title,
            url: parameters.url,
            userId: parameters.userId
        },
        include: { user: { select: { username: true, name: true } } }
    });
    return { post };
};
exports.createPost = createPost;
const deletePost = async (parameters) => {
    const post = await prisma_js_1.prismaClient.post.findUnique({
        where: { id: parameters.postId }
    });
    if (!post)
        throw posts_types_js_1.PostError.NOT_FOUND;
    if (post.userId !== parameters.userId)
        throw posts_types_js_1.PostError.UNAUTHORIZED;
    await prisma_js_1.prismaClient.post.delete({
        where: { id: parameters.postId }
    });
};
exports.deletePost = deletePost;
