import { Client } from "pg";

export const DBClient = () => {
  const client = new Client({
    host: process.env.PG_SELF_MANAGED_HOST,
    user: process.env.PG_USER,
    database: process.env.DB,
    password: process.env.PG_SELF_MANAGED_PASS,
    port: 5432,
  });
  return client;
};
