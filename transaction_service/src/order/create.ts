import { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent) => {
  console.log("SNS Topic listner through SQS");
  console.log(event);

  return {
    statusCode: 200,
    body: JSON.stringify("Listening to the queue"),
  };
};
