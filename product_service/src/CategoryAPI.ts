import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { CategoryService } from "./Service/CategoryService";
import { CategoryRepository } from "./Repository/CategoryRepo";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import "./Utils";
const service = new CategoryService(new CategoryRepository());

export const handler = middy(
  (
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    const isRoot = event.pathParameters === null;
    switch (event.httpMethod.toLowerCase()) {
      case "post":
        if (isRoot) {
          return service.createCategory(event);
        }
      case "get":
        return isRoot
          ? service.getAlleCategories(event)
          : service.getCategory(event);
      case "put":
        if (!isRoot) {
          return service.editCategory(event);
        }
      case "delete":
        if (!isRoot) {
          return service.deleteCategory(event);
        }
    }
    return service.ErrorResponse(event);
  }
).use(jsonBodyParser());
