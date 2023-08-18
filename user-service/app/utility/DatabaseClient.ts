import { Client } from "pg";

export const DBClient = async () => {
  return new Client({
    host: process.env.PG_SELF_MANAGED_HOST,
    user: process.env.PG_USER,
    database: process.env.DB,
    password: process.env.PG_SELF_MANAGED_PASS,
    port: 5432,
  });
};
