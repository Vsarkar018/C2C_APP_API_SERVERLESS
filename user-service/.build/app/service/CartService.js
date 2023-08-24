"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const response_1 = require("../utility/response");
const http_status_codes_1 = require("http-status-codes");
const password_1 = require("../utility/password");
const class_transformer_1 = require("class-transformer");
const CartInput_1 = require("../models/dto/CartInput");
const error_1 = require("../utility/error");
const messageQueue_1 = require("../messageQueue");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
class CartService {
    constructor(repository) {
        this.repository = repository;
    }
    //Cart Section
    CreateCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.VerifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.FORBIDDEN, "authorization failed");
                const input = (0, class_transformer_1.plainToClass)(CartInput_1.CartInput, event.body);
                const error = yield (0, error_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.NOT_FOUND, error);
                let currentCart = yield this.repository.findShoppingCart(payload.user_id);
                if (!currentCart) {
                    currentCart = yield this.repository.creatShoppingCart(payload.user_id);
                }
                if (!currentCart) {
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create Cart");
                }
                let currentProduct = yield this.repository.findCartItemByProductId(input.productId);
                if (currentProduct) {
                    yield this.repository.updateCartItemByProductId(input.productId, (currentProduct.item_qty += input.qty));
                }
                else {
                    const { data, status } = yield (0, messageQueue_1.PullData)({
                        action: "PULL_PRODUCT_DATA",
                        productId: input.productId,
                    });
                    console.log("Getting Product", data);
                    if (status !== http_status_codes_1.StatusCodes.OK) {
                        return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to get Product Info");
                    }
                    let cartItem = data.data;
                    cartItem.cart_id = currentCart.cart_id;
                    cartItem.item_qty = input.qty;
                    yield this.repository.createCartItem(cartItem);
                }
                const cartItems = yield this.repository.findCartItemsByCartId(currentCart.cart_id);
                return (0, response_1.SuccessResponse)(cartItems);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
        });
    }
    UpdateCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.VerifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.FORBIDDEN, "authorization failed");
                const input = (0, class_transformer_1.plainToClass)(CartInput_1.UpdateCartInput, event.body);
                const error = yield (0, error_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.NOT_FOUND, error);
                const cartItemId = Number(event.pathParameters.id);
                const cartItems = yield this.repository.updateCartItemById(cartItemId, input.qty);
                if (!cartItems) {
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.NOT_FOUND, "CartItem not found");
                }
                return (0, response_1.SuccessResponse)(cartItems);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
        });
    }
    GetCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.VerifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.FORBIDDEN, "authorization failed");
                const data = yield this.repository.findCartItems(payload.user_id);
                return (0, response_1.SuccessResponse)(data);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
        });
    }
    DeleteCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.VerifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.FORBIDDEN, "authorization failed");
                const cartItemId = Number(event.pathParameters.id);
                const cartItems = yield this.repository.deleteCartItem(cartItemId);
                return (0, response_1.SuccessResponse)(cartItems);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
        });
    }
    CollectPayment(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.VerifyToken)(token);
                //Intiliaze payment gateway
                //Autheticate payment confirmatain
                //get cart items
                if (!payload)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.FORBIDDEN, "authorization failed");
                const cartItems = yield this.repository.findCartItems(payload.user_id);
                //Send SNS topic to create order
                const params = {
                    Message: JSON.stringify(cartItems),
                    TopicArn: process.env.SNS_TOPIC,
                    MessageAttributes: {
                        actionType: {
                            DataType: "String",
                            StringValue: "place_order",
                        },
                    },
                };
                const sns = new aws_sdk_1.default.SNS();
                const response = yield sns.publish(params).promise();
                //Send tentative message to user
                return (0, response_1.SuccessResponse)({ message: "Payment Processiing....", response });
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
        });
    }
}
exports.CartService = CartService;
//# sourceMappingURL=CartService.js.map