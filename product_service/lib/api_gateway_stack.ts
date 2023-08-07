import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ApiGatewayStackProps {
  productService: IFunction;
}

export class ApiGatewayStack extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id);
    this.addResources("product", props.productService);
  }

  addResources(serviceName: string, handler: IFunction) {
    const apgw = new LambdaRestApi(this, `${serviceName}-ApiGtw`, {
      restApiName: `${serviceName}-Service`,
      handler,
      proxy: false,
    });
    const productResources = apgw.root.addResource("product");
    productResources.addMethod("GET");
    productResources.addMethod("POST");

    const productIdResource = productResources.addResource("{id}");
    productIdResource.addMethod("GET");
    productIdResource.addMethod("POST");

    const categoryResource = apgw.root.addResource("category");
    categoryResource.addMethod("GET");
    categoryResource.addMethod("POST");

    const categoryIdResource = categoryResource.addResource("{id}");
    categoryIdResource.addMethod("GET");
    categoryIdResource.addMethod("PUT");
    categoryIdResource.addMethod("DELETE");

    const dealResources = apgw.root.addResource("deals");
    dealResources.addMethod("GET");
    dealResources.addMethod("POST");

    const dealIdResources = dealResources.addResource("{id}");
    dealIdResources.addMethod("GET")
    dealIdResources.addMethod("PUT")
    dealIdResources.addMethod("DELETE")
  }
}
