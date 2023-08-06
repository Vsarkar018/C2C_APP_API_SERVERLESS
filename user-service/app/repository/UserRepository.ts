import { UserModel } from "../models/UserModel";
import { DBOperation } from "./dbOperations";
export class UserRepository extends DBOperation {
  constructor() {
    super();
  }
  async createAccount({ email, password, phone, salt, user_type }: UserModel) {
    const queryString =
      "INSERT INTO users(phone,email,password,salt,user_type)values($1,$2,$3,$4,$5) RETURNING *";
    const values = [phone, email, password, salt, user_type];
    const result = await this.executeQuery(queryString, values);
    console.log(result);

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
  }

  async findAccount(email: string) {
    const queryString =
      "SELECT user_id , email,password,phone,salt, user_type , verification_code , expiry FROM users WHERE email = $1";
    const values = [email];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("user does not exists with provided email id");
  }
  async updateVerificationCode(userId: string, code: number, expiry: Date) {
    const queryString =
      "UPDATE users SET verification_code=$1, expiry=$2 WHERE user_id=$3 AND verified=FALSE RETURNING *";
    const values = [code, expiry, userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("user already verified");
  }
  async updateVerificationStatus(userId: string) {
    const queryString =
      "UPDATE users SET verified=TRUE WHERE user_id=$1 AND verified=FALSE RETURNING *";
    const values = [userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("user already verified");
  }
}
