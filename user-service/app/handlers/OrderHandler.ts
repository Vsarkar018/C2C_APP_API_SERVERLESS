import middy from "@middy/core";
import { CartService } from "../service/CartService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { CartRepository } from "../repository/cartRepository";

const cartService = new CartService(new CartRepository());

export const CollectPayment = middy((event: APIGatewayProxyEventV2) => {
  return cartService.CollectPayment(event);
});
// export const GetOrders = middy((event: APIGatewayProxyEventV2) => {
//   return cartService.GetOrders(event);
// }).use(bodyParser());

// export const OrderById = middy((event: APIGatewayProxyEventV2) => {
//   return cartService.GetOrder(event);
// }).use(bodyParser());
