import { APIGatewayProxyEventV2 } from "aws-lambda";

export class UserService{
    constructor(){}
    async CreateUser(event :APIGatewayProxyEventV2){
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
    }
}