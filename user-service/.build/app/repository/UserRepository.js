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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const dbOperations_1 = require("./dbOperations");
class UserRepository extends dbOperations_1.DBOperation {
    constructor() {
        super();
    }
    createAccount({ email, password, phone, salt, user_type }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "INSERT INTO users(phone,email,password,salt,user_type)values($1,$2,$3,$4,$5) RETURNING *";
            const values = [phone, email, password, salt, user_type];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
        });
    }
    findAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "SELECT user_id , email,password,phone,salt, user_type , verification_code , expiry FROM users WHERE email = $1";
            const values = [email];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("user does not exists with provided email id");
        });
    }
    updateVerificationCode(userId, code, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "UPDATE users SET verification_code=$1, expiry=$2 WHERE user_id=$3 AND verified=FALSE RETURNING *";
            const values = [code, expiry, userId];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("user already verified");
        });
    }
    updateVerificationStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "UPDATE users SET verified=TRUE WHERE user_id=$1 AND verified=FALSE RETURNING *";
            const values = [userId];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("user already verified");
        });
    }
    updateUser(userId, firstName, lastName, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "UPDATE users SET first_name=$1, last_name=$2 , user_type=$3 WHERE user_id=$4 AND verified=TRUE RETURNING *";
            const values = [firstName, lastName, userType, userId];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("Error while updating user");
        });
    }
    createProfile(userId, { first_name, last_name, user_type, address: { address_line1, address_line2, city, postCode, country }, }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateUser(userId, first_name, last_name, user_type);
            const queryString = "INSERT INTO address(user_id ,address_line1,address_line2 , city , post_code , country)values($1,$2,$3,$4,$5,$6) RETURNING *";
            const values = [
                userId,
                address_line1,
                address_line2,
                city,
                postCode,
                country,
            ];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("error while Creating Profile");
        });
    }
    getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileQueryString = "SELECT first_name, last_name , email , phone , user_type, verified ,stripe_id , payment_id FROM users WHERE user_id=$1";
            const values = [userId];
            const profileResult = yield this.executeQuery(profileQueryString, values);
            if (profileResult.rowCount < 1) {
                throw new Error("user profile does not exits");
            }
            const userProfile = profileResult.rows[0];
            const addressQueryString = "SELECT id , address_line1 , address_line2 , city , post_code , country FROM address WHERE user_id=$1";
            const addressResult = yield this.executeQuery(addressQueryString, [userId]);
            if (addressResult.rowCount > 0) {
                userProfile.address = addressResult.rows;
            }
            return userProfile;
        });
    }
    editProfile(userId, { first_name, last_name, user_type, address: { address_line1, address_line2, city, postCode, country, id }, }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateUser(userId, first_name, last_name, user_type);
            const queryString = "UPDATE address SET address_line1=$1,address_line2=$2, city=$3 , post_code=$4 , country=$5 WHERE id=$6";
            const values = [address_line1, address_line2, city, postCode, country, id];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount < 1) {
                throw new Error("error while updating  Profile");
            }
            return true;
        });
    }
    updateUserPayment({ userId, paymentId, customerId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "UPDATE users SET stripe_id=$1, payment_id=$2  WHERE user_id=$3  RETURNING *";
            const values = [customerId, paymentId, userId];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("Error while updating user payment");
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map