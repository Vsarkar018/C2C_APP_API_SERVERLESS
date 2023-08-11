import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../Repository/ProductRepo";
import { ErrorResponse, SuccessResponse } from "../Utils/response";
import { ProductInput } from "../Models/dto/ProductInput";
import { AppValidationError } from "../Utils/error";
import { StatusCodes } from "http-status-codes";
import { plainToClass } from "class-transformer";

export class ProductService {
  _repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this._repository = repository;
  }
  async createProduct(event: APIGatewayEvent) {
    try {
      const input = plainToClass(ProductInput, JSON.parse(event.body!));
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(StatusCodes.NOT_FOUND, error);

      const data = await this._repository.createProduct(input);
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async getProduct(event: APIGatewayEvent) {
    try {
      const productID = event.pathParameters?.id;
      if (!productID) {
        return ErrorResponse(
          StatusCodes.FORBIDDEN,
          "PLEASE PROVIDE PRODUCT ID"
        );
      }
      const data = await this._repository.getProduct(productID);
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async getAllProducts(event: APIGatewayEvent) {
    try {
      const data = await this._repository.geAllProducts();
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async editProduct(event: APIGatewayEvent) {
    try {
      const input = plainToClass(ProductInput, JSON.parse(event.body!));
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(StatusCodes.NOT_FOUND, error);
      const productID = event.pathParameters?.id;
      if (!productID) {
        return ErrorResponse(
          StatusCodes.FORBIDDEN,
          "PLEASE PROVIDE PRODUCT ID"
        );
      }
      input.id = productID;
      const data = await this._repository.updateProduct(input);
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async deleteProduct(event: APIGatewayEvent) {
    try {
      const productID = event.pathParameters?.id;
      if (!productID) {
        return ErrorResponse(
          StatusCodes.FORBIDDEN,
          "PLEASE PROVIDE PRODUCT ID"
        );
      }
      const data = await this._repository.deleteProduct(productID);
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
}
