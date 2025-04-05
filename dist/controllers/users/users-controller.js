"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getMe = void 0;
const prisma_js_1 = require("../../extras/prisma.js");
const users_types_js_1 = require("./users-types.js");
const getMe = async (parameters) => {
    const user = await prisma_js_1.prismaClient.user.findUnique({
        where: { id: parameters.userId },
        select: { id: true, username: true, name: true, createdAt: true, updatedAt: true }
    });
    if (!user)
        throw users_types_js_1.GetMeError.BAD_REQUEST;
    return { user };
};
exports.getMe = getMe;
const getAllUsers = async (parameters) => {
    const users = await prisma_js_1.prismaClient.user.findMany({
        orderBy: { name: "asc" },
        skip: (parameters.page - 1) * parameters.pageSize,
        take: parameters.pageSize,
        select: { id: true, username: true, name: true, createdAt: true, updatedAt: true }
    });
    return { users };
};
exports.getAllUsers = getAllUsers;
