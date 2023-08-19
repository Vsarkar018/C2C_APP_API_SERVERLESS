"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectPayment = void 0;
const core_1 = __importDefault(require("@middy/core"));
const CartService_1 = require("../service/CartService");
const tsyringe_1 = require("tsyringe");
const cartService = tsyringe_1.container.resolve(CartService_1.CartService);
exports.CollectPayment = (0, core_1.default)((event) => {
    return cartService.CollectPayment(event);
});
// export const GetOrders = middy((event: APIGatewayProxyEventV2) => {
//   return cartService.GetOrders(event);
// }).use(bodyParser());
// export const OrderById = middy((event: APIGatewayProxyEventV2) => {
//   return cartService.GetOrder(event);
// }).use(bodyParser());
//# sourceMappingURL=OrderHandler.js.map