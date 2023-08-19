import middy from "@middy/core";
import { CartService } from "../service/CartService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { container } from "tsyringe";

const cartService = container.resolve(CartService);

export const CollectPayment = middy((event: APIGatewayProxyEventV2) => {
  return cartService.CollectPayment(event);
});
// export const GetOrders = middy((event: APIGatewayProxyEventV2) => {
//   return cartService.GetOrders(event);
// }).use(bodyParser());

// export const OrderById = middy((event: APIGatewayProxyEventV2) => {
//   return cartService.GetOrder(event);
// }).use(bodyParser());
