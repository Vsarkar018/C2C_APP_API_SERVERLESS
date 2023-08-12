import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ServiceStack } from "./service_stack";
import { ApiGatewayStack } from "./api_gateway_stack";
import { S3BucketStack } from "./s3Bucket_stack";

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const BucketStack = new S3BucketStack(this, "productImages");
    const { productService, categoryService, dealService, imageService } =
      new ServiceStack(this, "ProductService", {
        bucket: BucketStack.bucket.bucketName,
      });
    BucketStack.bucket.grantReadWrite(imageService);
    new ApiGatewayStack(this, "ProductApiGateway", {
      productService,
      categoryService,
      dealService,
      imageService,
    });
  }
}
