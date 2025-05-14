"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCommentsOnUserError = exports.GetCommentsOnMeError = exports.GetCommentsOnPostsError = exports.DeleteCommentError = exports.UpdateCommentError = exports.CreateCommentError = exports.GetCommentsError = void 0;
var GetCommentsError;
(function (GetCommentsError) {
    GetCommentsError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    GetCommentsError["COMMENTS_NOT_FOUND"] = "COMMENTS_NOT_FOUND";
    GetCommentsError["PAGE_BEYOND_LIMIT"] = "PAGE_BEYOND_LIMIT";
    GetCommentsError["UNKNOWN"] = "UNKNOWN";
})(GetCommentsError || (exports.GetCommentsError = GetCommentsError = {}));
var CreateCommentError;
(function (CreateCommentError) {
    CreateCommentError["INVALID_INPUT"] = "INVALID_INPUT";
    CreateCommentError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    CreateCommentError["UNKNOWN"] = "UNKNOWN";
})(CreateCommentError || (exports.CreateCommentError = CreateCommentError = {}));
var UpdateCommentError;
(function (UpdateCommentError) {
    UpdateCommentError["INVALID_INPUT"] = "INVALID_INPUT";
    UpdateCommentError["COMMENT_NOT_FOUND"] = "COMMENT_NOT_FOUND";
    UpdateCommentError["NO_CHANGES"] = "NO_CHANGES";
    UpdateCommentError["UNAUTHORIZED"] = "UNAUTHORIZED";
    UpdateCommentError["UNKNOWN"] = "UNKNOWN";
})(UpdateCommentError || (exports.UpdateCommentError = UpdateCommentError = {}));
var DeleteCommentError;
(function (DeleteCommentError) {
    DeleteCommentError["COMMENT_NOT_FOUND"] = "COMMENT_NOT_FOUND";
    DeleteCommentError["UNAUTHORIZED"] = "UNAUTHORIZED";
    DeleteCommentError["UNKNOWN"] = "UNKNOWN";
})(DeleteCommentError || (exports.DeleteCommentError = DeleteCommentError = {}));
var GetCommentsOnPostsError;
(function (GetCommentsOnPostsError) {
    GetCommentsOnPostsError["PAGE_BEYOND_LIMIT"] = "PAGE_BEYOND_LIMIT";
    GetCommentsOnPostsError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    GetCommentsOnPostsError["COMMENTS_NOT_FOUND"] = "COMMENTS_NOT_FOUND";
    GetCommentsOnPostsError["UNKNOWN"] = "UNKNOWN";
})(GetCommentsOnPostsError || (exports.GetCommentsOnPostsError = GetCommentsOnPostsError = {}));
var GetCommentsOnMeError;
(function (GetCommentsOnMeError) {
    GetCommentsOnMeError["COMMENTS_NOT_FOUND"] = "COMMENTS_NOT_FOUND";
    GetCommentsOnMeError["PAGE_BEYOND_LIMIT"] = "PAGE_BEYOND_LIMIT";
    GetCommentsOnMeError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    GetCommentsOnMeError["UNKNOWN"] = "UNKNOWN";
})(GetCommentsOnMeError || (exports.GetCommentsOnMeError = GetCommentsOnMeError = {}));
var GetCommentsOnUserError;
(function (GetCommentsOnUserError) {
    GetCommentsOnUserError["COMMENTS_NOT_FOUND"] = "COMMENTS_NOT_FOUND";
    GetCommentsOnUserError["PAGE_BEYOND_LIMIT"] = "PAGE_BEYOND_LIMIT";
    GetCommentsOnUserError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    GetCommentsOnUserError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    GetCommentsOnUserError["UNKNOWN"] = "UNKNOWN";
})(GetCommentsOnUserError || (exports.GetCommentsOnUserError = GetCommentsOnUserError = {}));
