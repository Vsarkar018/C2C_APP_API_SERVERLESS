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
let UserService = exports.UserService = class UserService {
    constructor(repository) {
        this.repository = repository;
    }
    CreateUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = event.body;
            console.log(body);
            this.repository.CreateUserOperations();
            return (0, response_1.SuccessResponse)({ message: "response from create user" });
        });
    }
    UserLogin(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from user login" });
        });
    }
    VerifyUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from verify user" });
        });
    }
    //Profile Section
    CreateProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from the Create profile" });
        });
    }
    EditProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from the Edit profile" });
        });
    }
    GetProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from the Get profile" });
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