import { APIGatewayEvent } from "aws-lambda";
import { CategoryRepository } from "../Repository/CategoryRepo";
import { ErrorResponse, SuccessResponse } from "../Utils/response";
import { StatusCodes } from "http-status-codes";
import { plainToClass } from "class-transformer";
import { CategoryInput } from "../Models/dto/CategoryInput";
import { AppValidationError } from "../Utils/error";

export class CategoryService {
  _repository: CategoryRepository;
  constructor(repository: CategoryRepository) {
    this._repository = repository;
  }
  async ErrorResponse(event: APIGatewayEvent) {
    return ErrorResponse(
      StatusCodes.NOT_FOUND,
      "requested method is not allowed"
    );
  }
  async createCategory(event: APIGatewayEvent) {
    try {
      const input = plainToClass(CategoryInput, event.body);
      const error = await AppValidationError(input);
      if (error) {
        return ErrorResponse(StatusCodes.NOT_FOUND, error);
      }
      const data = await this._repository.createCategory(input);
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async getCategory(event: APIGatewayEvent) {
    try {
      const categoryId = event.pathParameters?.id;
      const offset = Number(event.pathParameters?.offset);
      const perPage = Number(event.pathParameters?.perPage);
      if (!categoryId) {
        return ErrorResponse(
          StatusCodes.FORBIDDEN,
          "please provide category ID"
        );
      }
      const data = await this._repository.getCategory(
        categoryId,
        offset,
        perPage
      );
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async getAlleCategories(event: APIGatewayEvent) {
    try {
      const type = event.queryStringParameters?.type;
      if (type === "top") {
        const data = await this._repository.getTopCategories();
        return SuccessResponse(data);
      }
      const data = await this._repository.getAllCategories();
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async editCategory(event: APIGatewayEvent) {
    try {
      const categoryId = event.pathParameters?.id;
      if (!categoryId) {
        return ErrorResponse(
          StatusCodes.FORBIDDEN,
          "please provide category ID"
        );
      }
      const input = plainToClass(CategoryInput, event.body);
      const error = await AppValidationError(input);
      if (error) {
        return ErrorResponse(StatusCodes.NOT_FOUND, error);
      }
      input.id = categoryId;
      const data = await this._repository.editCategory(input);
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async deleteCategory(event: APIGatewayEvent) {
    try {
      const categoryId = event.pathParameters?.id;
      if (!categoryId) {
        return ErrorResponse(
          StatusCodes.FORBIDDEN,
          "please provide category ID"
        );
      }
      const data = await this._repository.deleteCategory(categoryId);
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
}
