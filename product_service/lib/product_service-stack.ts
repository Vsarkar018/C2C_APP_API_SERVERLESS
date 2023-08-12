import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ServiceStack } from "./service_stack";
import { ApiGatewayStack } from "./api_gateway_stack";
import { S3BucketStack } from "./S3Bucket-stack";

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const { bucket } = new S3BucketStack(this, "productImages");
    const { productService, categoryService, dealService, imageService } =
      new ServiceStack(this, "ProductService", {
        bucket: bucket.bucketName,
      });
    bucket.grantReadWrite(imageService);
    new ApiGatewayStack(this, "ProductApiGateway", {
      productService,
      categoryService,
      dealService,
      imageService,
    });
  }
}
