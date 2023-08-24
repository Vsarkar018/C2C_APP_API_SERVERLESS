"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePayment = void 0;
const core_1 = __importDefault(require("@middy/core"));
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const CartService_1 = require("../service/CartService");
const cartRepository_1 = require("../repository/cartRepository");
const cartService = new CartService_1.CartService(new cartRepository_1.CartRepository());
exports.CreatePayment = (0, core_1.default)((event) => {
    //   return cartService.CreatePayment(event);
}).use((0, http_json_body_parser_1.default)());
//# sourceMappingURL=PaymentHandler.js.map