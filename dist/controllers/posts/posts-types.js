"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserPostsBySlugError = exports.CreateCommentByPostIdError = exports.GetCommentsByPostIdError = exports.DeletePostError = exports.GetPostByIdError = exports.CreatePostError = exports.GetPostsError = void 0;
var GetPostsError;
(function (GetPostsError) {
    GetPostsError["POSTS_NOT_FOUND"] = "POSTS_NOT_FOUND";
    GetPostsError["PAGE_BEYOND_LIMIT"] = "PAGE_BEYOND_LIMIT";
    GetPostsError["UNKNOWN"] = "UNKNOWN";
})(GetPostsError || (exports.GetPostsError = GetPostsError = {}));
var CreatePostError;
(function (CreatePostError) {
    CreatePostError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    CreatePostError["TITLE_REQUIRED"] = "TITLE_REQUIRED";
    CreatePostError["UNKNOWN"] = "UNKNOWN";
})(CreatePostError || (exports.CreatePostError = CreatePostError = {}));
var GetPostByIdError;
(function (GetPostByIdError) {
    GetPostByIdError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    GetPostByIdError["UNKNOWN"] = "UNKNOWN";
})(GetPostByIdError || (exports.GetPostByIdError = GetPostByIdError = {}));
var DeletePostError;
(function (DeletePostError) {
    DeletePostError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    DeletePostError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    DeletePostError["UNKNOWN"] = "UNKNOWN";
})(DeletePostError || (exports.DeletePostError = DeletePostError = {}));
var GetCommentsByPostIdError;
(function (GetCommentsByPostIdError) {
    GetCommentsByPostIdError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    GetCommentsByPostIdError["UNKNOWN"] = "UNKNOWN";
})(GetCommentsByPostIdError || (exports.GetCommentsByPostIdError = GetCommentsByPostIdError = {}));
var CreateCommentByPostIdError;
(function (CreateCommentByPostIdError) {
    CreateCommentByPostIdError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    CreateCommentByPostIdError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    CreateCommentByPostIdError["UNKNOWN"] = "UNKNOWN";
})(CreateCommentByPostIdError || (exports.CreateCommentByPostIdError = CreateCommentByPostIdError = {}));
var GetUserPostsBySlugError;
(function (GetUserPostsBySlugError) {
    GetUserPostsBySlugError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    GetUserPostsBySlugError["POSTS_NOT_FOUND"] = "POSTS_NOT_FOUND";
    GetUserPostsBySlugError["PAGE_BEYOND_LIMIT"] = "PAGE_BEYOND_LIMIT";
    GetUserPostsBySlugError["UNKNOWN"] = "UNKNOWN";
})(GetUserPostsBySlugError || (exports.GetUserPostsBySlugError = GetUserPostsBySlugError = {}));
