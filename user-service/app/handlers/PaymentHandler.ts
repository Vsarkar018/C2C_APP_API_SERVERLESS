import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { CartService } from "../service/CartService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { CartRepository } from "../repository/cartRepository";

const cartService =new CartService(new CartRepository())
export const CreatePayment = middy((event: APIGatewayProxyEventV2) => {
  //   return cartService.CreatePayment(event);
}).use(jsonBodyParser());
