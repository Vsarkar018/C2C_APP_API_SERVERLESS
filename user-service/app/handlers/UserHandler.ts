import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserService } from "../service/UserService";

const service = new UserService();

export const Signup = async (event: APIGatewayProxyEventV2) => {
  console.log(event);
  return service.CreateUser(event);
};
export const Login = async (event: APIGatewayProxyEventV2) => {
  console.log(event);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "response from Signup",
      data: {},
    }),
  };
};
export const Verify = async (event: APIGatewayProxyEventV2) => {
  console.log(event);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "response from Signup",
      data: {},
    }),
  };
};
export const Profile = async (event: APIGatewayProxyEventV2) => {
  console.log(event);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "response from Signup",
      data: {},
    }),
  };
};
export const Payment = async (event: APIGatewayProxyEventV2) => {
  console.log(event);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "response from Signup",
      data: {},
    }),
  };
};
export const Cart = async (event: APIGatewayProxyEventV2) => {
  console.log(event);
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "response from Signup",
      data: {},
    }),
  };
};
