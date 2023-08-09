import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../Repository/ProductRepo";
import { ErrorResponse, SuccessResponse } from "../Utils/response";
import { ProductInput } from "../Models/dto/ProductInput";
import { AppValidationError } from "../Utils/error";
import { StatusCodes } from "http-status-codes";
import { plainToClass } from "class-transformer";

export class ProductService {
  repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this.repository = repository;
  }
  async createProduct(event: APIGatewayEvent) {
    try {
      const input = plainToClass(ProductInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(StatusCodes.NOT_FOUND, error);
      const data = this.repository.createProduct(input);
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async getProduct(event: APIGatewayEvent) {
    return SuccessResponse({ msg: "Product fetched!" });
  }
  async getAllProducts(event: APIGatewayEvent) {
    return SuccessResponse({ msg: "All products fetched!" });
  }
  async editProduct(event: APIGatewayEvent) {
    return SuccessResponse({ msg: "Product Edited!" });
  }
  async deleteProduct(event: APIGatewayEvent) {
    return SuccessResponse({ msg: "Product Deleted!" });
  }
}
