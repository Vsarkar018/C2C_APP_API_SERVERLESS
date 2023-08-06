import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/UserModel";

const APP_SECRET = "my_32_bit_secret";

export const GenSalt = async () => {
  return await bcrypt.genSalt(10);
};
export const GetHashedPassowrd = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};
export const ValidatePassaword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GetHashedPassowrd(enteredPassword, salt)) === savedPassword;
};

export const GetToken = async ({
  email,
  user_type,
  phone,
  user_id,
}: UserModel) => {
  return await jwt.sign(
    {
      user_id,
      email,
      phone,
      user_type,
    },
    APP_SECRET,
    { expiresIn: "30d" }
  );
};

export const VerifyToken = async (
  token: string
): Promise<UserModel | false> => {
  try {
    if (!token || !token.startsWith("Bearer ")) {
      return false;
    }
    const payload = await jwt.verify(token.split(" ")[1], APP_SECRET);
    return payload as UserModel;
  } catch (error) {
    console.log(error);
    return false;
  }
};
