import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIAYCBDFT3CQ2EP6KUV",
    secretAccessKey: "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",
  },
});

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const file = event.queryStringParameters?.file;
  const fileName = `${uuid()}__${file}`;
  const s3Params = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    ContentType: "image/jpeg",
  });
  const url = await getSignedUrl(s3Client, s3Params, {
    expiresIn: 1000 * 60 * 10,
  });
  console.log("UPLOAD URL :", s3Params, url);

  return {
    statusCode: 200,
    body: JSON.stringify({
      url,
      key: fileName,
    }),
  };
};
