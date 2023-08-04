import { ErrorResponse, SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/UserRepository";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { SignupInput } from "../models/dto/SignupInput";
import { AppValidationError } from "../utility/error";
import { StatusCodes } from "http-status-codes";
import { GenSalt, GetHashedPassowrd } from "../utility/password";

@autoInjectable()
export class UserService {
  repository: UserRepository;
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async CreateUser(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(SignupInput, event.body);
      const error = await AppValidationError(input);
      if (error) {
        return ErrorResponse(StatusCodes.NOT_FOUND, error);
      }
      const salt = await GenSalt();
      const hashPassword = await GetHashedPassowrd(input.password, salt);
      const data = await this.repository.createAccount({
        email: input.email,
        password: hashPassword,
        phone: input.phone,
        salt: salt,
        user_type: "Buyer",
      });
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);

      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR,error)
    }
  }


  
  async UserLogin(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from user login" });
  }

  async VerifyUser(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from verify user" });
  }

  //Profile Section
  async CreateProfile(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from the Create profile" });
  }
  async EditProfile(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from the Edit profile" });
  }
  async GetProfile(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from the Get profile" });
  }

  //Cart Section
  async CreateCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from the Create Cart" });
  }
  async UpdateCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from the Edit Cart" });
  }
  async GetCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from the Get Cart" });
  }

  //Payment Section
  async CreatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({
      message: "response from the Create Payment Method",
    });
  }
  async GetPaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from the Get payment Method" });
  }
  async UpdatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({
      message: "response from the Update Payment Method",
    });
  }
}
