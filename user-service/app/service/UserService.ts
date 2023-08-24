import { ErrorResponse, SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/UserRepository";
import { plainToClass } from "class-transformer";
import { SignupInput } from "../models/dto/SignupInput";
import { AppValidationError } from "../utility/error";
import { StatusCodes } from "http-status-codes";
import {
  GenSalt,
  GetHashedPassowrd,
  GetToken,
  ValidatePassaword,
  VerifyToken,
} from "../utility/password";
import { LoginInput } from "../models/dto/LoginInput";
import {
  GenerateAccessCode,
  SendVerificationCode,
} from "../utility/Notification";
import { VerificationInput } from "../models/dto/UpdateInput";
import { TimeDifference } from "../DateHelper";
import { ProfileInput } from "../models/dto/AddressInput";

export class UserService {
  repository: UserRepository;
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async ResponseWithError(event: APIGatewayProxyEventV2) {
    return ErrorResponse(
      StatusCodes.NOT_FOUND,
      "requested method is not supported"
    );
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

      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }

  async UserLogin(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(LoginInput, event.body);

      const error = await AppValidationError(input);
      if (error) return ErrorResponse(StatusCodes.NOT_FOUND, error);
      const data = await this.repository.findAccount(input.email);
      const verified = await ValidatePassaword(
        input.password,
        data.password,
        data.salt
      );

      if (!verified) {
        throw new Error("password does not match!");
      }
      const token = await GetToken(data);
      return SuccessResponse({ token });
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }

  async GetVerificationToken(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload)
        return ErrorResponse(StatusCodes.FORBIDDEN, "Authorization failed");
      const { code, expiry } = GenerateAccessCode();
      await this.repository.updateVerificationCode(
        payload.user_id,
        code,
        expiry
      );

      // const response = await SendVerificationCode(code, payload.phone);
      console.log(code, expiry);

      return SuccessResponse({
        message: "verification code is sent to your registered mobile number",
      });
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }

  async VerifyUser(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) {
        return ErrorResponse(StatusCodes.FORBIDDEN, "Authorization failed");
      }

      const input = plainToClass(VerificationInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(StatusCodes.NOT_FOUND, error);

      const { verification_code, expiry } = await this.repository.findAccount(
        payload.email
      );
      if (verification_code === parseInt(input.code)) {
        const currentTime = new Date();
        const diff = TimeDifference(expiry, currentTime.toISOString(), "m");
        if (diff <= 0) {
          return ErrorResponse(
            StatusCodes.FORBIDDEN,
            "verfication code expired"
          );
        }
      } else {
        return ErrorResponse(
          StatusCodes.FORBIDDEN,
          "Verification Failed Given verification code is wrong"
        );
      }
      await this.repository.updateVerificationStatus(payload.user_id);
      console.log("User Verified Successfully");

      return SuccessResponse({ message: "User Verified Successfully" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }

  //Profile Section
  async CreateProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload)
        return ErrorResponse(StatusCodes.FORBIDDEN, "authorization Failed");
      const input = plainToClass(ProfileInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(StatusCodes.BAD_REQUEST, error);

      const result = await this.repository.createProfile(
        payload.user_id,
        input
      );
      return SuccessResponse({ message: "User Profile created successfully" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async EditProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload)
        return ErrorResponse(StatusCodes.FORBIDDEN, "authorization Failed");
      const input = plainToClass(ProfileInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(StatusCodes.BAD_REQUEST, error);

      await this.repository.editProfile(payload.user_id, input);
      return SuccessResponse({ message: "User Profile Updated  successfully" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
  }
  async GetProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) {
        return ErrorResponse(StatusCodes.FORBIDDEN, "authorization Failed");
      }
      const result = await this.repository.getUserProfile(payload.user_id);
      console.log(result);

      return SuccessResponse(result);
    } catch (error) {
      console.log(error);
      return ErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    }
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
