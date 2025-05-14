"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLikesOnUserError = exports.GetLikesOnMeError = exports.DeleteLikeError = exports.LikePostError = exports.GetLikesError = void 0;
var GetLikesError;
(function (GetLikesError) {
    GetLikesError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    GetLikesError["LIKES_NOT_FOUND"] = "LIKES_NOT_FOUND";
    GetLikesError["PAGE_NOT_FOUND"] = "PAGE_NOT_FOUND";
    GetLikesError["UNKNOWN"] = "UNKNOWN";
})(GetLikesError || (exports.GetLikesError = GetLikesError = {}));
var LikePostError;
(function (LikePostError) {
    LikePostError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    LikePostError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    LikePostError["UNKNOWN"] = "UNKNOWN";
    LikePostError["ALREADY_LIKED"] = "ALREADY_LIKED";
})(LikePostError || (exports.LikePostError = LikePostError = {}));
var DeleteLikeError;
(function (DeleteLikeError) {
    DeleteLikeError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    DeleteLikeError["LIKE_NOT_FOUND"] = "LIKE_NOT_FOUND";
    DeleteLikeError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    DeleteLikeError["UNKNOWN"] = "UNKNOWN";
})(DeleteLikeError || (exports.DeleteLikeError = DeleteLikeError = {}));
var GetLikesOnMeError;
(function (GetLikesOnMeError) {
    GetLikesOnMeError["LIKES_NOT_FOUND"] = "LIKES_NOT_FOUND";
    GetLikesOnMeError["PAGE_NOT_FOUND"] = "PAGE_NOT_FOUND";
    GetLikesOnMeError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    GetLikesOnMeError["UNKNOWN"] = "UNKNOWN";
})(GetLikesOnMeError || (exports.GetLikesOnMeError = GetLikesOnMeError = {}));
var GetLikesOnUserError;
(function (GetLikesOnUserError) {
    GetLikesOnUserError["LIKES_NOT_FOUND"] = "LIKES_NOT_FOUND";
    GetLikesOnUserError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    GetLikesOnUserError["PAGE_NOT_FOUND"] = "PAGE_NOT_FOUND";
    GetLikesOnUserError["POST_NOT_FOUND"] = "POST_NOT_FOUND";
    GetLikesOnUserError["UNKNOWN"] = "UNKNOWN";
})(GetLikesOnUserError || (exports.GetLikesOnUserError = GetLikesOnUserError = {}));
