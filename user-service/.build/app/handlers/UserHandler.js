"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProfile = exports.EditProfile = exports.CreateProfile = exports.GetVerificationCode = exports.Verify = exports.Login = exports.SignUp = void 0;
const UserService_1 = require("../service/UserService");
const core_1 = __importDefault(require("@middy/core"));
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const UserRepository_1 = require("../repository/UserRepository");
const userService = new UserService_1.UserService(new UserRepository_1.UserRepository());
exports.SignUp = (0, core_1.default)((event) => {
    return userService.CreateUser(event);
}).use((0, http_json_body_parser_1.default)());
exports.Login = (0, core_1.default)((event) => {
    return userService.UserLogin(event);
}).use((0, http_json_body_parser_1.default)());
exports.Verify = (0, core_1.default)((event) => {
    return userService.VerifyUser(event);
}).use((0, http_json_body_parser_1.default)());
exports.GetVerificationCode = (0, core_1.default)((event) => {
    return userService.GetVerificationToken(event);
}).use((0, http_json_body_parser_1.default)());
exports.CreateProfile = (0, core_1.default)((event) => {
    return userService.CreateProfile(event);
}).use((0, http_json_body_parser_1.default)());
exports.EditProfile = (0, core_1.default)((event) => {
    return userService.EditProfile(event);
}).use((0, http_json_body_parser_1.default)());
exports.GetProfile = (0, core_1.default)((event) => {
    return userService.GetProfile(event);
}).use((0, http_json_body_parser_1.default)());
//# sourceMappingURL=UserHandler.js.map