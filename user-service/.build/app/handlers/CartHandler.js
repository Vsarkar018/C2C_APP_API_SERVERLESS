"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCart = exports.EditCart = exports.DeleteCart = exports.CreateCart = void 0;
const core_1 = __importDefault(require("@middy/core"));
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const CartService_1 = require("../service/CartService");
const tsyringe_1 = require("tsyringe");
const cartService = tsyringe_1.container.resolve(CartService_1.CartService);
exports.CreateCart = (0, core_1.default)((event) => {
    return cartService.CreateCart(event);
}).use((0, http_json_body_parser_1.default)());
exports.DeleteCart = (0, core_1.default)((event) => {
    return cartService.DeleteCart(event);
}).use((0, http_json_body_parser_1.default)());
exports.EditCart = (0, core_1.default)((event) => {
    return cartService.UpdateCart(event);
}).use((0, http_json_body_parser_1.default)());
exports.GetCart = (0, core_1.default)((event) => {
    return cartService.GetCart(event);
}).use((0, http_json_body_parser_1.default)());
//# sourceMappingURL=CartHandler.js.map