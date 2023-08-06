import { AddressModel } from "../models/AddressModel";
import { ProfileInput } from "../models/dto/AddressInput";
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
  async updateVerificationCode(userId: number, code: number, expiry: Date) {
    const queryString =
      "UPDATE users SET verification_code=$1, expiry=$2 WHERE user_id=$3 AND verified=FALSE RETURNING *";
    const values = [code, expiry, userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("user already verified");
  }
  async updateVerificationStatus(userId: number) {
    const queryString =
      "UPDATE users SET verified=TRUE WHERE user_id=$1 AND verified=FALSE RETURNING *";
    const values = [userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("user already verified");
  }
  async updateUser(
    userId: number,
    firstName: string,
    lastName: string,
    userType: string
  ) {
    const queryString =
      "UPDATE users SET first_name=$1, last_name=$2 , user_type=$3 WHERE user_id=$4 AND verified=TRUE RETURNING *";
    const values = [firstName, lastName, userType, userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("Error while updating user");
  }
  async createProfile(
    userId: number,
    {
      first_name,
      last_name,
      user_type,
      address: { address_line1, address_line2, city, postCode, country },
    }: ProfileInput
  ) {
    await this.updateUser(userId, first_name, last_name, user_type);
    const queryString =
      "INSERT INTO address(user_id ,address_line1,address_line2 , city , post_code , country)values($1,$2,$3,$4,$5,$6) RETURNING *";
    const values = [
      userId,
      address_line1,
      address_line2,
      city,
      postCode,
      country,
    ];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as AddressModel;
    }

    throw new Error("error while Creating Profile");
  }
  async getUserProfile(userId: number) {
    const profileQueryString =
      "SELECT first_name, last_name , email , phone , user_type, verified FROM users WHERE user_id=$1";
    const values = [userId];
    const profileResult = await this.executeQuery(profileQueryString, values);
    if (profileResult.rowCount < 1) {
      throw new Error("user profile does not exits");
    }
    const userProfile = profileResult.rows[0] as UserModel;
    const addressQueryString =
      "SELECT id , address_line1 , address_line2 , city , post_code , country FROM address WHERE user_id=$1";
    const addressResult = await this.executeQuery(addressQueryString, [userId]);
    if (addressResult.rowCount > 0) {
      userProfile.address = addressResult.rows as AddressModel[];
    }
    return userProfile;
  }
  async editProfile(
    userId: number,
    {
      first_name,
      last_name,
      user_type,
      address: { address_line1, address_line2, city, postCode, country,id },
    }: ProfileInput
  ) {
    await this.updateUser(userId, first_name, last_name, user_type);
    const queryString =
      "UPDATE address SET address_line1=$1,address_line2=$2, city=$3 , post_code=$4 , country=$5 WHERE id=$6";
    const values = [
      address_line1,
      address_line2,
      city,
      postCode,
      country,
      id,
    ];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount < 1) {
      throw new Error("error while updating  Profile");
    }
    return true;
  }
}
