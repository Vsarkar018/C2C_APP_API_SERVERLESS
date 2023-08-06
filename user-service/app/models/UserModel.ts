import { AddressModel } from "./AddressModel";

export interface UserModel {
  user_id?: number;
  email: string;
  password: string;
  salt: string;
  phone: string;
  user_type: "Buyer" | "Seller";
  first_name?: string;
  last_name?: string;
  verification_code?: number;
  expiry?: string;
  profile_pic?: string;
  address?: AddressModel[];
}
