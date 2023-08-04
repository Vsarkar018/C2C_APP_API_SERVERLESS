import { UserModel } from "../models/UserModel";
import { DBClient } from "../utility/DatabaseClient";
export class UserRepository {
  constructor() {}
  async createAccount({ email, password, phone, salt, user_type }: UserModel) {
    const client = await DBClient();
    await client.connect();

    const queryString =
      "INSERT INTO users(phone,email,password,salt,user_type)values($1,$2,$3,$4,$5) RETURNING *";
    const values = [phone, email, password, salt, user_type];
    const result = await client.query(queryString, values);
    await client.end();
    console.log(result);
    
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
  }
}
