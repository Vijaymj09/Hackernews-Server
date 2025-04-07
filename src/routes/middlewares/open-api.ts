export const openapi = {
  openapi: "3.0.0",
  info: {
    title: "HackerNews Server API",
    version: "1.0.0",
  },
  tags: [
    { name: "Auth", description: "Authentication related routes" },
    { name: "Users", description: "User management routes" },
    { name: "Posts", description: "Post creation and management" },
    { name: "Likes", description: "Post like/unlike functionality" },
    { name: "Comments", description: "Post comments management" },
  ],
  components: {
    securitySchemes: {
      TokenAuth: {
        type: "apiKey",
        in: "header",
        name: "token",
      },
    },
  },
  security: [
    {
      TokenAuth: [],
    },
  ],
  paths: {
    "/auth/sign-in": {
      post: {
        tags: ["Auth"],
        summary: "Sign up with username and password",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string", format: "password" }, // 👈 updated
                  name: { type: "string" },
                },
                required: ["username", "password", "name"],
              },
            },
          },
        },
        responses: {
          "200": { description: "User created successfully" },
          "409": { description: "Username already exists" },
        },
      },
    },
    "/auth/log-in": {
      post: {
        tags: ["Auth"],
        summary: "Log in with username and password",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string" },
                  password: { type: "string", format: "password" }, // 👈 updated
                },
                required: ["username", "password"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Successful login" },
          "401": { description: "Invalid credentials" },
        },
      },
    },

    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current authenticated user",
        responses: {
          "200": { description: "User profile" },
          "404": { description: "User not found" },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 2 },
          },
        ],
        responses: {
          "200": { description: "List of users" },
        },
      },
    },
    "/posts": {
      get: {
        tags: ["Posts"],
        summary: "Get all posts",
        responses: {
          "200": { description: "List of posts" },
        },
      },
      post: {
        tags: ["Posts"],
        summary: "Create a new post",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                },
                required: ["title", "content"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Post created" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/posts/me": {
      get: {
        tags: ["Posts"],
        summary: "Get posts created by current user",
        responses: {
          "200": { description: "List of user posts" },
        },
      },
    },
    "/posts/{postId}": {
      delete: {
        tags: ["Posts"],
        summary: "Delete a post by ID",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Post deleted" },
          "403": { description: "Not authorized" },
          "404": { description: "Post not found" },
        },
      },
    },
    "/likes/on/{postId}": {
      post: {
        tags: ["Likes"],
        summary: "Like a post",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "201": { description: "Post liked successfully" },
          "200": { description: "You have already liked this post" },
          "401": { description: "Unauthorized" },
          "404": { description: "Post not found" },
          "500": { description: "Unknown server error" },
        },
      },
      get: {
        tags: ["Likes"],
        summary: "Get all likes on a post",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 2 },
          },
        ],
        responses: {
          "200": { description: "Likes returned successfully" },
          "404": { description: "Post not found or no likes" },
          "500": { description: "Unknown error" },
        },
      },
      delete: {
        tags: ["Likes"],
        summary: "Delete like from a post",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Like deleted successfully" },
          "404": { description: "Like not found or not authored by user" },
          "500": { description: "Unknown error" },
        },
      },
    },
    "/comments/on/{postId}": {
      post: {
        tags: ["Comments"],
        summary: "Create a comment on a post",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  content: { type: "string" },
                },
                required: ["content"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Comment created successfully" },
          "404": { description: "Post not found" },
          "500": { description: "Comment creation failed or unknown error" },
        },
      },
      get: {
        tags: ["Comments"],
        summary: "Get all comments on a post",
        parameters: [
          {
            name: "postId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
        ],
        responses: {
          "200": { description: "Comments returned successfully" },
          "404": { description: "Post not found or no comments" },
        },
      },
    },
    "/comments/{commentId}": {
      delete: {
        tags: ["Comments"],
        summary: "Delete a comment",
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Comment deleted successfully" },
          "403": { description: "Unauthorized or not your comment" },
        },
      },
      patch: {
        tags: ["Comments"],
        summary: "Update a comment",
        parameters: [
          {
            name: "commentId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  content: { type: "string" },
                },
                required: ["content"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Comment updated successfully" },
          "403": { description: "Unauthorized or not your comment" },
        },
      },
    },
  },
};