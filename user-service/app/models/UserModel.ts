export interface UserModel {
  user_id?: string;
  email: string;
  password: string;
  salt: string;
  phone: string;
  user_type: "Buyer" | "Seller";
}
