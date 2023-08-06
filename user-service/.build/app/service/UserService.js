"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const response_1 = require("../utility/response");
const UserRepository_1 = require("../repository/UserRepository");
const tsyringe_1 = require("tsyringe");
const class_transformer_1 = require("class-transformer");
const SignupInput_1 = require("../models/dto/SignupInput");
const error_1 = require("../utility/error");
const http_status_codes_1 = require("http-status-codes");
const password_1 = require("../utility/password");
const LoginInput_1 = require("../models/dto/LoginInput");
const Notification_1 = require("../utility/Notification");
const UpdateInput_1 = require("../models/dto/UpdateInput");
const DateHelper_1 = require("../DateHelper");
const AddressInput_1 = require("../models/dto/AddressInput");
let UserService = exports.UserService = class UserService {
    constructor(repository) {
        this.repository = repository;
    }
    ResponseWithError(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.NOT_FOUND, "requested method is not supported");
        });
    }
    CreateUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = (0, class_transformer_1.plainToClass)(SignupInput_1.SignupInput, event.body);
                const error = yield (0, error_1.AppValidationError)(input);
                if (error) {
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.NOT_FOUND, error);
                }
                const salt = yield (0, password_1.GenSalt)();
                const hashPassword = yield (0, password_1.GetHashedPassowrd)(input.password, salt);
                const data = yield this.repository.createAccount({
                    email: input.email,
                    password: hashPassword,
                    phone: input.phone,
                    salt: salt,
                    user_type: "Buyer",
                });
                return (0, response_1.SuccessResponse)(data);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
        });
    }
    UserLogin(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = (0, class_transformer_1.plainToClass)(LoginInput_1.LoginInput, event.body);
                const error = yield (0, error_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.NOT_FOUND, error);
                const data = yield this.repository.findAccount(input.email);
                const verified = yield (0, password_1.ValidatePassaword)(input.password, data.password, data.salt);
                if (!verified) {
                    throw new Error("password does not match!");
                }
                const token = yield (0, password_1.GetToken)(data);
                return (0, response_1.SuccessResponse)({ token });
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
        });
    }
    GetVerificationToken(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.VerifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.FORBIDDEN, "Authorization failed");
                const { code, expiry } = (0, Notification_1.GenerateAccessCode)();
                yield this.repository.updateVerificationCode(payload.user_id, code, expiry);
                // const response = await SendVerificationCode(code, payload.phone);
                console.log(code, expiry);
                return (0, response_1.SuccessResponse)({
                    message: "verification code is sent to your registered mobile number",
                });
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
        });
    }
    VerifyUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.VerifyToken)(token);
                if (!payload) {
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.FORBIDDEN, "Authorization failed");
                }
                const input = (0, class_transformer_1.plainToClass)(UpdateInput_1.VerificationInput, event.body);
                const error = yield (0, error_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.NOT_FOUND, error);
                const { verification_code, expiry } = yield this.repository.findAccount(payload.email);
                if (verification_code === parseInt(input.code)) {
                    const currentTime = new Date();
                    const diff = (0, DateHelper_1.TimeDifference)(expiry, currentTime.toISOString(), "m");
                    if (diff <= 0) {
                        return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.FORBIDDEN, "verfication code expired");
                    }
                }
                else {
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.FORBIDDEN, "Verification Failed Given verification code is wrong");
                }
                yield this.repository.updateVerificationStatus(payload.user_id);
                console.log("User Verified Successfully");
                return (0, response_1.SuccessResponse)({ message: "User Verified Successfully" });
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
        });
    }
    //Profile Section
    CreateProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.VerifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.FORBIDDEN, "authorization Failed");
                const input = (0, class_transformer_1.plainToClass)(AddressInput_1.ProfileInput, event.body);
                const error = yield (0, error_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, error);
                const result = yield this.repository.createProfile(payload.user_id, input);
                return (0, response_1.SuccessResponse)({ message: "User Profile created successfully" });
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
        });
    }
    EditProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.VerifyToken)(token);
                if (!payload)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.FORBIDDEN, "authorization Failed");
                const input = (0, class_transformer_1.plainToClass)(AddressInput_1.ProfileInput, event.body);
                const error = yield (0, error_1.AppValidationError)(input);
                if (error)
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.BAD_REQUEST, error);
                yield this.repository.editProfile(payload.user_id, input);
                return (0, response_1.SuccessResponse)({ message: "User Profile Updated  successfully" });
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
        });
    }
    GetProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.VerifyToken)(token);
                if (!payload) {
                    return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.FORBIDDEN, "authorization Failed");
                }
                const result = yield this.repository.getUserProfile(payload.user_id);
                console.log(result);
                return (0, response_1.SuccessResponse)(result);
            }
            catch (error) {
                console.log(error);
                return (0, response_1.ErrorResponse)(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error);
            }
        });
    }
    //Cart Section
    CreateCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from the Create Cart" });
        });
    }
    UpdateCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from the Edit Cart" });
        });
    }
    GetCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from the Get Cart" });
        });
    }
    //Payment Section
    CreatePaymentMethod(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({
                message: "response from the Create Payment Method",
            });
        });
    }
    GetPaymentMethod(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from the Get payment Method" });
        });
    }
    UpdatePaymentMethod(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({
                message: "response from the Update Payment Method",
            });
        });
    }
};
exports.UserService = UserService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [UserRepository_1.UserRepository])
], UserService);
//# sourceMappingURL=UserService.js.map