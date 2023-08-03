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
export const Login = async (event: APIGatewayProxyEventV2) => {
  return service.UserLogin(event);
};
export const Verify = async (event: APIGatewayProxyEventV2) => {
  return service.VerifyUser(event);
};
export const Profile = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.CreateProfile(event);
  } else if (httpMethod === "put") {
    return service.EditProfile(event);
  } else if (httpMethod === "get") {
    return service.GetProfile(event);
  }
  return ErrorResponse(
    StatusCodes.NOT_FOUND,
    "requested method is not supported"
  );
};
export const Payment = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.CreatePaymentMethod(event);
  } else if (httpMethod === "put") {
    return service.UpdatePaymentMethod(event);
  } else if (httpMethod === "get") {
    return service.GetPaymentMethod(event);
  }
  return ErrorResponse(
    StatusCodes.NOT_FOUND,
    "requested method is not supported"
  );
};
export const Cart = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.CreateCart(event);
  } else if (httpMethod === "put") {
    return service.UpdateCart(event);
  } else if (httpMethod === "get") {
    return service.GetCart(event);
  }
  return ErrorResponse(
    StatusCodes.NOT_FOUND,
    "requested method is not supported"
  );
};
