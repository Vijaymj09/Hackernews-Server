"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInWithUsernameAndPassword = exports.signUpWithUsernameAndPassword = exports.createPasswordHash = void 0;
const crypto_1 = require("crypto");
const index_js_1 = require("../../integrations/prisma/index.js");
const authentication_types_js_1 = require("./authentication-types.js");
const createPasswordHash = (parameters) => {
    return (0, crypto_1.createHash)("sha256").update(parameters.password).digest("hex");
};
exports.createPasswordHash = createPasswordHash;
const generateSessionToken = () => {
    return (0, crypto_1.createHash)("sha256").update(Math.random().toString()).digest("hex");
};
const signUpWithUsernameAndPassword = async (parameters) => {
    try {
        const existingUser = await index_js_1.prismaClient.user.findUnique({
            where: {
                username: parameters.username,
            },
        });
        if (existingUser) {
            throw authentication_types_js_1.SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
        }
        const hashedPassword = (0, exports.createPasswordHash)({
            password: parameters.password,
        });
        const sessionToken = generateSessionToken();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        // Create user with account and session in a transaction
        const result = await index_js_1.prismaClient.$transaction(async (tx) => {
            // Create the user first
            const newUser = await tx.user.create({
                data: {
                    username: parameters.username,
                    name: parameters.name,
                    email: parameters.email,
                    emailVerified: false,
                    displayUsername: parameters.username,
                    // Removed 'about' field as it does not exist in the Prisma schema
                    image: null,
                },
            });
            // Create the account
            await tx.account.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    accountId: (0, crypto_1.randomUUID)(),
                    providerId: "credentials",
                    password: hashedPassword,
                    createdAt: now,
                    updatedAt: now,
                    userId: newUser.id,
                },
            });
            // Create the session
            await tx.session.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    token: sessionToken,
                    expiresAt,
                    createdAt: now,
                    updatedAt: now,
                    userId: newUser.id,
                },
            });
            // Get the complete user with all relations
            const user = await tx.user.findUnique({
                where: {
                    id: newUser.id,
                },
                include: {
                    accounts: true,
                    sessions: true,
                },
            });
            if (!user) {
                throw new Error("Failed to create user");
            }
            return {
                token: sessionToken,
                user,
            };
        });
        return result;
    }
    catch (e) {
        console.error(e);
        throw authentication_types_js_1.SignUpWithUsernameAndPasswordError.UNKNOWN;
    }
};
exports.signUpWithUsernameAndPassword = signUpWithUsernameAndPassword;
const logInWithUsernameAndPassword = async (parameters) => {
    const passwordHash = (0, exports.createPasswordHash)({
        password: parameters.password,
    });
    // Find user with account in a single query
    const user = await index_js_1.prismaClient.user.findFirst({
        where: {
            username: parameters.username,
            accounts: {
                some: {
                    providerId: "credentials",
                    password: passwordHash,
                },
            },
        },
        include: {
            accounts: true,
        },
    });
    if (!user) {
        throw authentication_types_js_1.LogInWithUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
    }
    const sessionToken = generateSessionToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    // Create a new session
    await index_js_1.prismaClient.session.create({
        data: {
            id: (0, crypto_1.randomUUID)(),
            token: sessionToken,
            expiresAt,
            createdAt: now,
            updatedAt: now,
            userId: user.id,
        },
    });
    return {
        token: sessionToken,
        user,
    };
};
exports.logInWithUsernameAndPassword = logInWithUsernameAndPassword;
