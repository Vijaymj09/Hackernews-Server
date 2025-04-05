"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInWithUsernameAndPassword = exports.signUpWithUsernameAndPassword = void 0;
const crypto_1 = require("crypto");
const jwt = require("jsonwebtoken");
const environment_js_1 = require("../../environment.js");
const prisma_js_1 = require("../../extras/prisma.js");
const authentication_types_js_1 = require("./authentication-types.js");
const signUpWithUsernameAndPassword = async (parameters) => {
    // Check if user already exists
    const isUserExistingAlready = await checkIfUserExistsAlready({
        username: parameters.username,
    });
    if (isUserExistingAlready) {
        throw authentication_types_js_1.SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
    }
    // Create password hash
    const passwordHash = await createPasswordHash({
        password: parameters.password,
    });
    // Create new user
    const user = await prisma_js_1.prismaClient.user.create({
        data: {
            username: parameters.username,
            password: passwordHash,
            name: parameters.name,
        },
    });
    // Generate JWT token
    const token = createJWToken({
        id: user.id,
        username: user.username,
    });
    return {
        token,
        user,
    };
};
exports.signUpWithUsernameAndPassword = signUpWithUsernameAndPassword;
const logInWithUsernameAndPassword = async (parameters) => {
    // Create password hash
    const passwordHash = createPasswordHash({
        password: parameters.password,
    });
    // Find user
    const user = await prisma_js_1.prismaClient.user.findUnique({
        where: {
            username: parameters.username,
            password: passwordHash,
        },
    });
    if (!user) {
        throw authentication_types_js_1.LogInWtihUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
    }
    // Generate JWT token
    const token = createJWToken({
        id: user.id,
        username: user.username,
    });
    return {
        token,
        user,
    };
};
exports.logInWithUsernameAndPassword = logInWithUsernameAndPassword;
const createJWToken = (parameters) => {
    const jwtPayload = {
        iss: "hackernews-server",
        sub: parameters.id,
        username: parameters.username,
    };
    return jwt.sign(jwtPayload, environment_js_1.jwtSecretKey, {
        expiresIn: "30d",
    });
};
const checkIfUserExistsAlready = async (parameters) => {
    const existingUser = await prisma_js_1.prismaClient.user.findUnique({
        where: {
            username: parameters.username,
        },
    });
    return !!existingUser;
};
const createPasswordHash = (parameters) => {
    return (0, crypto_1.createHash)("sha256").update(parameters.password).digest("hex");
};
