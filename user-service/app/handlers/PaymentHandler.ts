import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import { CartService } from "../service/CartService";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { container } from "tsyringe";

const cartService = container.resolve(CartService);

export const CreatePayment = middy((event: APIGatewayProxyEventV2) => {
  //   return cartService.CreatePayment(event);
}).use(jsonBodyParser());
