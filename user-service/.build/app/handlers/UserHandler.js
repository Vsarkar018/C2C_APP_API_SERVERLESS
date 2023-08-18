"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectPayment = exports.Cart = exports.Payment = exports.Profile = exports.Verify = exports.Login = exports.Signup = void 0;
const tsyringe_1 = require("tsyringe");
const UserService_1 = require("../service/UserService");
const core_1 = __importDefault(require("@middy/core"));
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const CartServie_1 = require("../service/CartServie");
require("dotenv/config");
const userService = tsyringe_1.container.resolve(UserService_1.UserService);
const cartService = tsyringe_1.container.resolve(CartServie_1.CartService);
exports.Signup = (0, core_1.default)((event) => {
    return userService.CreateUser(event);
}).use((0, http_json_body_parser_1.default)());
exports.Login = (0, core_1.default)((event) => {
    return userService.UserLogin(event);
}).use((0, http_json_body_parser_1.default)());
exports.Verify = (0, core_1.default)((event) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    if (httpMethod === "post") {
        return userService.VerifyUser(event);
    }
    else if (httpMethod === "get") {
        return userService.GetVerificationToken(event);
    }
    return userService.ResponseWithError(event);
}).use((0, http_json_body_parser_1.default)());
exports.Profile = (0, core_1.default)((event) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    if (httpMethod === "post") {
        return userService.CreateProfile(event);
    }
    else if (httpMethod === "put") {
        return userService.EditProfile(event);
    }
    else if (httpMethod === "get") {
        return userService.GetProfile(event);
    }
    return userService.ResponseWithError(event);
}).use((0, http_json_body_parser_1.default)());
exports.Payment = (0, core_1.default)((event) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    if (httpMethod === "post") {
        return userService.CreatePaymentMethod(event);
    }
    else if (httpMethod === "put") {
        return userService.UpdatePaymentMethod(event);
    }
    else if (httpMethod === "get") {
        return userService.GetPaymentMethod(event);
    }
    return userService.ResponseWithError(event);
}).use((0, http_json_body_parser_1.default)());
exports.Cart = (0, core_1.default)((event) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    if (httpMethod === "post") {
        return cartService.CreateCart(event);
    }
    else if (httpMethod === "put") {
        return cartService.UpdateCart(event);
    }
    else if (httpMethod === "get") {
        return cartService.GetCart(event);
    }
    else if (httpMethod === "delete") {
        return cartService.DeleteCart(event);
    }
    return cartService.ResponseWithError(event);
}).use((0, http_json_body_parser_1.default)());
exports.CollectPayment = (0, core_1.default)((event) => {
    return cartService.CollectPayment(event);
}).use((0, http_json_body_parser_1.default)());
//# sourceMappingURL=UserHandler.js.map