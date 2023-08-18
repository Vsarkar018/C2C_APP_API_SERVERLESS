import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ProductService } from "./Service/ProductService";
import { ProductRepository } from "./Repository/ProductRepo";
import "./Utils";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";

const service = new ProductService(new ProductRepository());

export const handler = middy(
  (
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    return service.handleQueueOperations(event);
  }
).use(jsonBodyParser());
