import { SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/UserRepository";
import { autoInjectable } from "tsyringe";

@autoInjectable()
export class UserService {
  repository: UserRepository;
  constructor(repository: UserRepository) {
    this.repository = repository;
  }
  async CreateUser(event: APIGatewayProxyEventV2) {
    const body = event.body;
    console.log(body);
    this.repository.CreateUserOperations()

    return SuccessResponse({ message: "response from create user" });
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
