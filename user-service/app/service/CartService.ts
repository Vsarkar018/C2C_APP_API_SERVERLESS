import { ErrorResponse, SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { StatusCodes } from "http-status-codes";
import { CartRepository } from "../repository/cartRepository";
import { VerifyToken } from "../utility/password";
import { plainToClass } from "class-transformer";
import { CartInput, UpdateCartInput } from "../models/dto/CartInput";
import { AppValidationError } from "../utility/error";
import { CartItemModel } from "../models/CartItemModel";
import { PullData } from "../messageQueue";
import { UserRepository } from "../repository/UserRepository";
import aws from "aws-sdk";
import {
  APPLICATION_FEE,
  CreatePaymentSession,
  RetrievePayment,
  STRIPE_FEE,
} from "../utility/Payment";
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
      const cartItems = await this.repository.findCartItems(payload.user_id);
      const amount = cartItems.reduce(
        (sum, item) => sum + item.price * item.item_qty,
        0
      );
      const appFee = APPLICATION_FEE(amount);
      const stripeFee = STRIPE_FEE(amount);

      const totalAmount = amount + appFee + stripeFee;

      return SuccessResponse({ cartItems, totalAmount, appFee });
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
      if (!payload)
        return ErrorResponse(StatusCodes.FORBIDDEN, "authorization failed");
      const { stripe_id, email, phone } =
        await new UserRepository().getUserProfile(payload.user_id);
      const cartItems = await this.repository.findCartItems(payload.user_id);
      const totalAmout = cartItems.reduce(
        (sum, item) => sum + item.price * item.item_qty,
        0
      );
      const appFee = APPLICATION_FEE(totalAmout);
      const stripeFee = STRIPE_FEE(totalAmout);

      const amount = totalAmout + appFee + stripeFee;

      //Intiliaze payment gateway
      const { customerId, paymentId, publishableKey, secret } =
        await CreatePaymentSession({
          email,
          phone,
          customerId: stripe_id,
          amount,
        });
      await new UserRepository().updateUserPayment({
        userId: payload.user_id,
        customerId,
        paymentId,
      });
      //Autheticate payment confirmatain

      //get cart items

      return SuccessResponse({ secret, publishableKey });
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async PlaceOrder(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload)
        return ErrorResponse(StatusCodes.FORBIDDEN, "authorization failed");
      const { payment_id } = await new UserRepository().getUserProfile(
        payload.user_id
      );
      const paymentInfo = await RetrievePayment(payment_id);
      if (paymentInfo.status === "succeeded") {
        // const cartItems = await this.repository.findCartItems(payload.user_id);

        // const params = {
        //   Message: JSON.stringify(cartItems),
        //   TopicArn: process.env.SNS_TOPIC,
        //   MessageAtrributes: {
        //     actionType: {
        //       DataTypes: "String",
        //       StringValue: "place_order",
        //     },
        //   },
        // };
        // const sns = new aws.SNS();
        // const response = await sns.publish(params).promise();
        // console.log(response);

        return SuccessResponse({
          message: "Payment Successfully Initialized",
          paymentInfo,
        });
      }
      console.log(paymentInfo);
      return ErrorResponse(StatusCodes.BAD_GATEWAY, "something went wrong");
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
}
