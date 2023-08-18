"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = exports.GetToken = exports.ValidatePassaword = exports.GetHashedPassowrd = exports.GenSalt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const APP_SECRET = "my_32_bit_secret";
const GenSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.genSalt(10);
});
exports.GenSalt = GenSalt;
const GetHashedPassowrd = (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcryptjs_1.default.hash(password, salt);
});
exports.GetHashedPassowrd = GetHashedPassowrd;
const ValidatePassaword = (enteredPassword, savedPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return (yield (0, exports.GetHashedPassowrd)(enteredPassword, salt)) === savedPassword;
});
exports.ValidatePassaword = ValidatePassaword;
const GetToken = ({ email, user_type, phone, user_id, }) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jsonwebtoken_1.default.sign({
        user_id,
        email,
        phone,
        user_type,
    }, APP_SECRET, { expiresIn: "30d" });
});
exports.GetToken = GetToken;
const VerifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!token || !token.startsWith("Bearer ")) {
            return false;
        }
        const payload = yield jsonwebtoken_1.default.verify(token.split(" ")[1], APP_SECRET);
        return payload;
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
exports.VerifyToken = VerifyToken;
//# sourceMappingURL=password.js.map