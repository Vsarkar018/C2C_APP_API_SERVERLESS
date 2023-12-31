import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../Repository/ProductRepo";
import { ErrorResponse, SuccessResponse } from "../Utils/response";
import { ProductInput } from "../Models/dto/ProductInput";
import { AppValidationError } from "../Utils/error";
import { StatusCodes } from "http-status-codes";
import { plainToClass } from "class-transformer";
import { CategoryRepository } from "../Repository/CategoryRepo";
import { ServiceInput } from "../Models/dto/ServiceInput";

export class ProductService {
  _repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this._repository = repository;
  }
  async ErrorResponse(event: APIGatewayEvent) {
    return ErrorResponse(
      StatusCodes.NOT_FOUND,
      "requested method is not allowed"
    );
  }
  async createProduct(event: APIGatewayEvent) {
    try {
      const input = plainToClass(ProductInput, JSON.parse(event.body!));
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(StatusCodes.NOT_FOUND, error);

      const data = await this._repository.createProduct(input);
      await new CategoryRepository().addItem({
        id: input.categoryId,
        products: [data._id],
      });
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
      if (!data) {
        return ErrorResponse(StatusCodes.NOT_FOUND, "Product Not found");
      }
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
      if (!data) {
        return ErrorResponse(StatusCodes.NOT_FOUND, "Product Not found");
      }
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
      const { category_id, delteResult } = await this._repository.deleteProduct(
        productID
      );
      if (!delteResult) {
        return ErrorResponse(StatusCodes.NOT_FOUND, "Product Not found");
      }
      await new CategoryRepository().removeItem({
        id: category_id,
        products: [productID],
      });
      return SuccessResponse(delteResult);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }

  async handleQueueOperations(event: APIGatewayEvent) {
    try {
      const input = plainToClass(ServiceInput, event.body);
      const error = await AppValidationError(input);
      if (error) {
        return ErrorResponse(StatusCodes.NOT_FOUND, error);
      }
      console.log("INPUT", input);

      const { _id, name, price, image_url } = await this._repository.getProduct(
        input.productId
      );
      console.log("Product Detaisl ", { _id, name, price, image_url });

      return SuccessResponse({ productId: _id, name, price, image_url });
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
}
