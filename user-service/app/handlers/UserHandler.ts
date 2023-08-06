import { container } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserService } from "../service/UserService";
import { ErrorResponse } from "../utility/response";
import { StatusCodes } from "http-status-codes";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";

const service = container.resolve(UserService);

export const Signup = middy((event: APIGatewayProxyEventV2) => {
  return service.CreateUser(event);
}).use(jsonBodyParser());

export const Login = middy((event: APIGatewayProxyEventV2) => {
  return service.UserLogin(event);
}).use(jsonBodyParser());

export const Verify = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.VerifyUser(event);
  } else if (httpMethod === "get") {
    return service.GetVerificationToken(event);
  }
  return service.ResponseWithError(event);
}).use(jsonBodyParser());

export const Profile = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.CreateProfile(event);
  } else if (httpMethod === "put") {
    return service.EditProfile(event);
  } else if (httpMethod === "get") {
    return service.GetProfile(event);
  }
  return service.ResponseWithError(event);
}).use(jsonBodyParser());

export const Payment = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.CreatePaymentMethod(event);
  } else if (httpMethod === "put") {
    return service.UpdatePaymentMethod(event);
  } else if (httpMethod === "get") {
    return service.GetPaymentMethod(event);
  }
  return service.ResponseWithError(event);
}).use(jsonBodyParser());

export const Cart = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.CreateCart(event);
  } else if (httpMethod === "put") {
    return service.UpdateCart(event);
  } else if (httpMethod === "get") {
    return service.GetCart(event);
  }
  return service.ResponseWithError(event);
}).use(jsonBodyParser());
