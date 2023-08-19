import { ErrorResponse, SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { StatusCodes } from "http-status-codes";
import { CartRepository } from "../repository/cartRepository";
import { VerifyToken } from "../utility/password";
import { plainToClass } from "class-transformer";
import { CartInput, UpdateCartInput } from "../models/dto/CartInput";
import { AppValidationError } from "../utility/error";
import { CartItemModel } from "../models/CartItemModel";
import { PullData } from "../messageQueue";
import aws from "aws-sdk";
@autoInjectable()
export class CartService {
  repository: CartRepository;
  constructor(repository: CartRepository) {
    this.repository = repository;
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
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload)
        return ErrorResponse(StatusCodes.FORBIDDEN, "authorization failed");
      const input = plainToClass(UpdateCartInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(StatusCodes.NOT_FOUND, error);
      const cartItemId = Number(event.pathParameters.id);
      const cartItems = await this.repository.updateCartItemById(
        cartItemId,
        input.qty
      );
      if (!cartItems) {
        return ErrorResponse(StatusCodes.NOT_FOUND, "CartItem not found");
      }
      return SuccessResponse(cartItems);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async GetCart(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload)
        return ErrorResponse(StatusCodes.FORBIDDEN, "authorization failed");
      const data = await this.repository.findCartItems(payload.user_id);
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async DeleteCart(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload)
        return ErrorResponse(StatusCodes.FORBIDDEN, "authorization failed");
      const cartItemId = Number(event.pathParameters.id);
      const cartItems = await this.repository.deleteCartItem(cartItemId);
      return SuccessResponse(cartItems);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async CollectPayment(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      //Intiliaze payment gateway

      //Autheticate payment confirmatain

      //get cart items

      if (!payload)
        return ErrorResponse(StatusCodes.FORBIDDEN, "authorization failed");
      const cartItems = await this.repository.findCartItems(payload.user_id);

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
      const sns = new aws.SNS();
      const response = await sns.publish(params).promise();

      //Send tentative message to user
      return SuccessResponse({ message: "Payment Processiing....", response });
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
}
