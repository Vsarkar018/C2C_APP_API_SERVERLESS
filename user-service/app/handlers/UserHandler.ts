
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserService } from "../service/UserService";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { UserRepository } from "../repository/UserRepository";
const userService = new UserService(new UserRepository())

export const Signup = middy((event: APIGatewayProxyEventV2) => {
  return userService.CreateUser(event);
}).use(jsonBodyParser());

export const Login = middy((event: APIGatewayProxyEventV2) => {
  return userService.UserLogin(event);
}).use(jsonBodyParser());

export const Verify = middy((event: APIGatewayProxyEventV2) => {
  return userService.VerifyUser(event);
}).use(jsonBodyParser());

export const GetVerificationCode = middy((event: APIGatewayProxyEventV2) => {
  return userService.GetVerificationToken(event);
}).use(jsonBodyParser());

export const CreateProfile = middy((event: APIGatewayProxyEventV2) => {
  return userService.CreateProfile(event);
}).use(jsonBodyParser());

export const EditProfile = middy((event: APIGatewayProxyEventV2) => {
  return userService.EditProfile(event);
}).use(jsonBodyParser());

export const GetProfile = middy((event: APIGatewayProxyEventV2) => {
  return userService.GetProfile(event);
}).use(jsonBodyParser());
