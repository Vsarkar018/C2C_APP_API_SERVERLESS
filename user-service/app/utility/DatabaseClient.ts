import { Client } from "pg";

export const DBClient = async () => {
  return new Client({
    host: "ec2-65-2-190-10.ap-south-1.compute.amazonaws.com",
    user: "user_service",
    database: "user_service",
    password: "user_service123",
    port: 5432,
  });
};
