"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.createComment = exports.getComments = void 0;
const prisma_js_1 = require("../../extras/prisma.js");
const comments_types_js_1 = require("./comments-types.js");
const getComments = async (parameters) => {
    const comments = await prisma_js_1.prismaClient.comment.findMany({
        where: { postId: parameters.postId },
        orderBy: { createdAt: "desc" },
        skip: (parameters.page - 1) * parameters.pageSize,
        take: parameters.pageSize,
        include: { user: { select: { username: true, name: true } } }
    });
    return { comments };
};
exports.getComments = getComments;
const createComment = async (parameters) => {
    const comment = await prisma_js_1.prismaClient.comment.create({
        data: {
            text: parameters.text,
            userId: parameters.userId,
            postId: parameters.postId
        },
        include: { user: { select: { username: true, name: true } } }
    });
    return { comment };
};
exports.createComment = createComment;
const updateComment = async (parameters) => {
    const comment = await prisma_js_1.prismaClient.comment.findUnique({
        where: { id: parameters.commentId }
    });
    if (!comment)
        throw comments_types_js_1.CommentError.NOT_FOUND;
    if (comment.userId !== parameters.userId)
        throw comments_types_js_1.CommentError.UNAUTHORIZED;
    const updatedComment = await prisma_js_1.prismaClient.comment.update({
        where: { id: parameters.commentId },
        data: { text: parameters.text },
        include: { user: { select: { username: true, name: true } } }
    });
    return { comment: updatedComment };
};
exports.updateComment = updateComment;
const deleteComment = async (parameters) => {
    const comment = await prisma_js_1.prismaClient.comment.findUnique({
        where: { id: parameters.commentId }
    });
    if (!comment)
        throw comments_types_js_1.CommentError.NOT_FOUND;
    if (comment.userId !== parameters.userId)
        throw comments_types_js_1.CommentError.UNAUTHORIZED;
    await prisma_js_1.prismaClient.comment.delete({
        where: { id: parameters.commentId }
    });
};
exports.deleteComment = deleteComment;
