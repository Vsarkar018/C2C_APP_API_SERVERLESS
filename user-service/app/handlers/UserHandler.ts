import { container } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserService } from "../service/UserService";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { CartService } from "../service/CartServie";

const userService = container.resolve(UserService);
const cartService = container.resolve(CartService);

export const Signup = middy((event: APIGatewayProxyEventV2) => {
  return userService.CreateUser(event);
}).use(jsonBodyParser());

export const Login = middy((event: APIGatewayProxyEventV2) => {
  return userService.UserLogin(event);
}).use(jsonBodyParser());

export const Verify = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return userService.VerifyUser(event);
  } else if (httpMethod === "get") {
    return userService.GetVerificationToken(event);
  }
  return userService.ResponseWithError(event);
}).use(jsonBodyParser());

export const Profile = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return userService.CreateProfile(event);
  } else if (httpMethod === "put") {
    return userService.EditProfile(event);
  } else if (httpMethod === "get") {
    return userService.GetProfile(event);
  }
  return userService.ResponseWithError(event);
}).use(jsonBodyParser());

export const Payment = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return userService.CreatePaymentMethod(event);
  } else if (httpMethod === "put") {
    return userService.UpdatePaymentMethod(event);
  } else if (httpMethod === "get") {
    return userService.GetPaymentMethod(event);
  }
  return userService.ResponseWithError(event);
}).use(jsonBodyParser());

export const Cart = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return cartService.CreateCart(event);
  } else if (httpMethod === "put") {
    return cartService.UpdateCart(event);
  } else if (httpMethod === "get") {
    return cartService.GetCart(event);
  } else if (httpMethod === "delete") {
    return cartService.DeleteCart(event);
  }
  return cartService.ResponseWithError(event);
}).use(jsonBodyParser());
