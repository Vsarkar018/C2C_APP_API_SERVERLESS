import { ErrorResponse, SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { StatusCodes } from "http-status-codes";
import { CartRepository } from "../repository/cartRepository";
import { VerifyToken } from "../utility/password";
import { plainToClass } from "class-transformer";
import { CartInput } from "../models/dto/CartInput";
import { AppValidationError } from "../utility/error";
import { CartItemModel } from "../models/CartItemModel";
import { PullData } from "../messageQueue";

@autoInjectable()
export class CartService {
  repository: CartRepository;
  constructor(repository: CartRepository) {
    this.repository = repository;
  }

  async ResponseWithError(event: APIGatewayProxyEventV2) {
    return ErrorResponse(
      StatusCodes.NOT_FOUND,
      "requested method is not supported"
    );
  }

  //Cart Section
  async CreateCart(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload)
        return ErrorResponse(StatusCodes.FORBIDDEN, "authorization failed");
      const input = plainToClass(CartInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(StatusCodes.NOT_FOUND, error);
      let currentCart = await this.repository.findShoppingCart(payload.user_id);
      if (!currentCart) {
        currentCart = await this.repository.creatShoppingCart(payload.user_id);
      }
      if (!currentCart) {
        return ErrorResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Failed to create Cart"
        );
      }
      let currentProduct = await this.repository.findCartItemByProductId(
        input.productId
      );
      if (currentProduct) {
        await this.repository.updateCartItemByProductId(
          input.productId,
          (currentProduct.item_qty += input.qty)
        );
      } else {
        const { data, status } = await PullData({
          action: "PULL_PRODUCT_DATA",
          productId: input.productId,
        });
        console.log("Getting Product", data);
        if (status !== StatusCodes.OK) {
          return ErrorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to get Product Info"
          );
        }

        let cartItem = data.data as CartItemModel;
        cartItem.cart_id = currentCart.cart_id;
        cartItem.item_qty = input.qty;
        await this.repository.createCartItem(cartItem);
      }
      const cartItems = await this.repository.findCartItemsByCartId(
        currentCart.cart_id
      );
      return SuccessResponse(cartItems);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async UpdateCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from the Edit Cart" });
  }
  async GetCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from the Get Cart" });
  }
  async DeleteCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from the delete Cart" });
  }
}
