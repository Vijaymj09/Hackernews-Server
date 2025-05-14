"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserPostsBySlug = exports.CreateCommentByPostId = exports.GetCommentsByPostId = exports.GetPostById = exports.DeletePost = exports.CreatePost = exports.GetUserPosts = exports.GetPosts = void 0;
exports.searchPostsByTitle = searchPostsByTitle;
const index_js_1 = require("../../integrations/prisma/index.js");
const posts_types_js_1 = require("./posts-types.js");
const GetPosts = async (parameter) => {
    try {
        const { page, limit, userId } = parameter;
        const skip = (page - 1) * limit;
        // checking if the posts exist
        const totalPosts = await index_js_1.prismaClient.post.count();
        if (totalPosts === 0) {
            throw posts_types_js_1.GetPostsError.POSTS_NOT_FOUND;
        }
        // checking if given page number doesn't exist or is beyond limits
        const totalPages = Math.ceil(totalPosts / limit);
        if (page > totalPages) {
            throw posts_types_js_1.GetPostsError.PAGE_BEYOND_LIMIT;
        }
        const posts = await index_js_1.prismaClient.post.findMany({
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                    },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        const formattedPosts = posts.map((post, index) => ({
            number: index + 1,
            id: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            userId: post.author.id,
            user: {
                username: post.author.username,
                name: post.author.name,
            },
            likeCount: post.likes.length,
            likedByUser: userId
                ? post.likes.some((like) => like.userId === userId)
                : false,
            comments: post.comments.map((comment) => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                user: {
                    username: comment.user.username,
                    name: comment.user.name,
                },
            })),
        }));
        return { posts: formattedPosts };
    }
    catch (e) {
        console.error(e);
        if (e === posts_types_js_1.GetPostsError.POSTS_NOT_FOUND) {
            throw posts_types_js_1.GetPostsError.POSTS_NOT_FOUND;
        }
        if (e === posts_types_js_1.GetPostsError.PAGE_BEYOND_LIMIT) {
            throw posts_types_js_1.GetPostsError.PAGE_BEYOND_LIMIT;
        }
        throw posts_types_js_1.GetPostsError.UNKNOWN;
    }
};
exports.GetPosts = GetPosts;
const GetUserPosts = async (parameters) => {
    try {
        const { userId, page, limit } = parameters;
        // checking if user has any posts
        const totalPosts = await index_js_1.prismaClient.post.count({
            where: { userId },
        });
        if (totalPosts === 0) {
            throw posts_types_js_1.GetPostsError.POSTS_NOT_FOUND;
        }
        // Check if requested page exists
        const totalPages = Math.ceil(totalPosts / limit);
        if (page > totalPages) {
            throw posts_types_js_1.GetPostsError.PAGE_BEYOND_LIMIT;
        }
        const posts = await index_js_1.prismaClient.post.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                author: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            },
        });
        return { posts };
    }
    catch (e) {
        console.error(e);
        if (e === posts_types_js_1.GetPostsError.POSTS_NOT_FOUND) {
            throw posts_types_js_1.GetPostsError.POSTS_NOT_FOUND;
        }
        if (e === posts_types_js_1.GetPostsError.PAGE_BEYOND_LIMIT) {
            throw posts_types_js_1.GetPostsError.PAGE_BEYOND_LIMIT;
        }
        throw posts_types_js_1.GetPostsError.UNKNOWN;
    }
};
exports.GetUserPosts = GetUserPosts;
const CreatePost = async (parameters) => {
    try {
        const { userId, title, content } = parameters;
        if (!title) {
            throw posts_types_js_1.CreatePostError.TITLE_REQUIRED;
        }
        if (!userId) {
            throw posts_types_js_1.CreatePostError.USER_NOT_FOUND;
        }
        const post = await index_js_1.prismaClient.post.create({
            data: {
                userId,
                title,
                content: content || "",
            },
            include: {
                author: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            },
        });
        return { post };
    }
    catch (e) {
        console.error(e);
        throw posts_types_js_1.CreatePostError.UNKNOWN;
    }
};
exports.CreatePost = CreatePost;
const DeletePost = async (parameters) => {
    try {
        const { postId, userId } = parameters;
        const post = await index_js_1.prismaClient.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw posts_types_js_1.DeletePostError.POST_NOT_FOUND;
        }
        if (post.userId !== userId) {
            throw posts_types_js_1.DeletePostError.USER_NOT_FOUND;
        }
        await index_js_1.prismaClient.post.delete({
            where: { id: postId },
        });
        return "Post deleted successfully";
    }
    catch (e) {
        console.error(e);
        if (e === posts_types_js_1.DeletePostError.POST_NOT_FOUND) {
            throw posts_types_js_1.DeletePostError.POST_NOT_FOUND;
        }
        if (e === posts_types_js_1.DeletePostError.USER_NOT_FOUND) {
            throw posts_types_js_1.DeletePostError.USER_NOT_FOUND;
        }
        throw posts_types_js_1.DeletePostError.UNKNOWN;
    }
};
exports.DeletePost = DeletePost;
// export const GetPostById = async (parameters: {
//   postId: string;
// }): Promise<GetPostByIdResult> => {
//   try {
//     const { postId } = parameters;
//     const post = await prisma.post.findUnique({
//       where: { id: postId },
//       include: {
//         author: {
//           select: {
//             username: true,
//             name: true,
//           },
//         },
//       },
//     });
//     if (!post) {
//       throw GetPostByIdError.POST_NOT_FOUND;
//     }
//     return { post };
//   } catch (e) {
//     console.error(e);
//     if (e === GetPostByIdError.POST_NOT_FOUND) {
//       throw GetPostByIdError.POST_NOT_FOUND;
//     }
//     throw GetPostByIdError.UNKNOWN;
//   }
// };
const GetPostById = async (parameters) => {
    try {
        const { postId, userId } = parameters;
        const post = await index_js_1.prismaClient.post.findUnique({
            where: { id: postId },
            include: {
                author: {
                    select: {
                        id: true, // ✅ Fix: Include id based on schema
                        username: true,
                        name: true,
                    },
                },
                likes: {
                    select: { userId: true },
                },
                comments: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!post)
            throw posts_types_js_1.GetPostByIdError.POST_NOT_FOUND;
        const formattedPost = {
            id: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            userId: post.author.id, // ✅ This works now
            user: {
                username: post.author.username,
                name: post.author.name,
            },
            likeCount: post.likes.length,
            likedByUser: userId ? post.likes.some((like) => like.userId === userId) : false,
            comments: post.comments.map((comment) => ({
                id: comment.id,
                content: comment.content,
                createdAt: comment.createdAt,
                user: {
                    username: comment.user.username,
                    name: comment.user.name,
                },
            })),
        };
        return { post: formattedPost };
    }
    catch (e) {
        console.error(e);
        if (e === posts_types_js_1.GetPostByIdError.POST_NOT_FOUND) {
            throw posts_types_js_1.GetPostByIdError.POST_NOT_FOUND;
        }
        throw posts_types_js_1.GetPostByIdError.UNKNOWN;
    }
};
exports.GetPostById = GetPostById;
const GetCommentsByPostId = async (parameters) => {
    try {
        const { postId } = parameters;
        const post = await index_js_1.prismaClient.post.findUnique({
            where: { id: postId },
        });
        if (!post) {
            throw posts_types_js_1.GetCommentsByPostIdError.POST_NOT_FOUND;
        }
        const comments = await index_js_1.prismaClient.comment.findMany({
            where: { postId },
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
        if (e === posts_types_js_1.GetCommentsByPostIdError.POST_NOT_FOUND) {
            throw posts_types_js_1.GetCommentsByPostIdError.POST_NOT_FOUND;
        }
        throw posts_types_js_1.GetCommentsByPostIdError.UNKNOWN;
    }
};
exports.GetCommentsByPostId = GetCommentsByPostId;
const CreateCommentByPostId = async (parameters) => {
    try {
        const { postId, userId, content } = parameters;
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
            throw posts_types_js_1.CreateCommentByPostIdError.POST_NOT_FOUND;
        }
        const user = await index_js_1.prismaClient.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw posts_types_js_1.CreateCommentByPostIdError.USER_NOT_FOUND;
        }
        const comment = await index_js_1.prismaClient.comment.create({
            data: {
                postId,
                userId,
                content,
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
        if (e === posts_types_js_1.CreateCommentByPostIdError.POST_NOT_FOUND) {
            throw posts_types_js_1.CreateCommentByPostIdError.POST_NOT_FOUND;
        }
        if (e === posts_types_js_1.CreateCommentByPostIdError.USER_NOT_FOUND) {
            throw posts_types_js_1.CreateCommentByPostIdError.USER_NOT_FOUND;
        }
        throw posts_types_js_1.CreateCommentByPostIdError.UNKNOWN;
    }
};
exports.CreateCommentByPostId = CreateCommentByPostId;
const GetUserPostsBySlug = async (parameters) => {
    try {
        const { slug, page, limit } = parameters;
        const user = await index_js_1.prismaClient.user.findUnique({
            where: { username: slug },
            select: {
                id: true,
            },
        });
        if (!user) {
            throw posts_types_js_1.GetUserPostsBySlugError.USER_NOT_FOUND;
        }
        const totalPosts = await index_js_1.prismaClient.post.count({
            where: { userId: user.id },
        });
        if (totalPosts === 0) {
            throw posts_types_js_1.GetUserPostsBySlugError.POSTS_NOT_FOUND;
        }
        const totalPages = Math.ceil(totalPosts / limit);
        if (page > totalPages) {
            throw posts_types_js_1.GetUserPostsBySlugError.PAGE_BEYOND_LIMIT;
        }
        const posts = await index_js_1.prismaClient.post.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: (page - 1) * limit,
            include: {
                author: {
                    select: {
                        username: true,
                        name: true,
                    },
                },
            },
        });
        return { posts };
    }
    catch (e) {
        console.error(e);
        if (e === posts_types_js_1.GetUserPostsBySlugError.USER_NOT_FOUND) {
            throw posts_types_js_1.GetUserPostsBySlugError.USER_NOT_FOUND;
        }
        if (e === posts_types_js_1.GetUserPostsBySlugError.POSTS_NOT_FOUND) {
            throw posts_types_js_1.GetUserPostsBySlugError.POSTS_NOT_FOUND;
        }
        if (e === posts_types_js_1.GetUserPostsBySlugError.PAGE_BEYOND_LIMIT) {
            throw posts_types_js_1.GetUserPostsBySlugError.PAGE_BEYOND_LIMIT;
        }
        throw posts_types_js_1.GetUserPostsBySlugError.UNKNOWN;
    }
};
exports.GetUserPostsBySlug = GetUserPostsBySlug;
async function searchPostsByTitle(query) {
    if (!query)
        return [];
    return index_js_1.prismaClient.post.findMany({
        where: {
            title: {
                contains: query,
                mode: "insensitive", // case-insensitive search
            },
        },
    });
}
