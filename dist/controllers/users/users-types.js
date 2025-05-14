"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersError = exports.GetMeError = void 0;
var GetMeError;
(function (GetMeError) {
    GetMeError["USER_NOT_FOUND"] = "USER_NOT_FOUND";
    GetMeError["PAGE_BEYOND_LIMIT"] = "PAGE_BEYOND_LIMIT";
    GetMeError["UNKNOWN"] = "UNKNOWN";
})(GetMeError || (exports.GetMeError = GetMeError = {}));
var GetUsersError;
(function (GetUsersError) {
    GetUsersError["USERS_NOT_FOUND"] = "USERS_NOT_FOUND";
    GetUsersError["PAGE_BEYOND_LIMIT"] = "PAGE_BEYOND_LIMIT";
    GetUsersError["UNKNOWN"] = "UNKNOWN";
})(GetUsersError || (exports.GetUsersError = GetUsersError = {}));
