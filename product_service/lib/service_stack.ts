import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface ServiceProps {
  bucket: string;
}

export class ServiceStack extends Construct {
  public readonly productService: NodejsFunction;
  public readonly categoryService: NodejsFunction;
  public readonly dealService: NodejsFunction;
  public readonly imageService: NodejsFunction;
  constructor(scope: Construct, id: string, props: ServiceProps) {
    super(scope, id);
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"],
      },
      environment: {
        BUCKET_NAME: props.bucket,
      },
      runtime: Runtime.NODEJS_18_X,
      timeout: Duration.seconds(10),
    };
    this.productService = new NodejsFunction(this, "productLambda", {
      entry: join(__dirname, "/../src/ProductAPI.ts"),
      ...nodeJsFunctionProps,
    });
    this.categoryService = new NodejsFunction(this, "categoryLambda", {
      entry: join(__dirname, "/../src/CategoryAPI.ts"),
      ...nodeJsFunctionProps,
    });
    this.dealService = new NodejsFunction(this, "dealsLambda", {
      entry: join(__dirname, "/../src/DealsAPI.ts"),
      ...nodeJsFunctionProps,
    });
    this.imageService = new NodejsFunction(this, "imageLambda", {
      entry: join(__dirname, "../src/ImageAPI.ts"),
      ...nodeJsFunctionProps,
    });
  }
}
