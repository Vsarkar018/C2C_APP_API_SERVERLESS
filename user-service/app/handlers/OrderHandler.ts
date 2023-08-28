import middy from "@middy/core";
import { CartService } from "../service/CartService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { CartRepository } from "../repository/cartRepository";
import jsonBodyParser from "@middy/http-json-body-parser";

const cartService = new CartService(new CartRepository());

export const CollectPayment = middy((event: APIGatewayProxyEventV2) => {
  return cartService.CollectPayment(event);
}).use(jsonBodyParser());

export const PlaceOrder = middy((event: APIGatewayProxyEventV2) => {
  return cartService.PlaceOrder(event);
}).use(jsonBodyParser());
