import { aws_apigateway } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ApiGatewayStackProps {
  createOrder: IFunction;
  getOrder: IFunction;
  getOrders: IFunction;
  getTransaction: IFunction;
}

interface ReasourceType {
  name: string;
  methods: string[];
  child?: ReasourceType;
}

export class ApiGatewayStack extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id);
    this.addResource("transaction", props);
  }
  addResource(
    serviceName: string,
    { getOrder, getOrders, getTransaction, createOrder }: ApiGatewayStackProps
  ) {
    const apigw = new aws_apigateway.RestApi(this, `${serviceName}-Api`, {
      defaultCorsPreflightOptions: {
        allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
      },
    });

    const orderResource = this.createEndpoints(getOrders, apigw, {
      name: "orders",
      methods: ["GET"],
    });
    this.addChildrenEndpoints("{id}", "GET", getOrder, orderResource);

    this.createEndpoints(getTransaction, apigw, {
      name: "transaction",
      methods: ["GET"],
    });
  }
  createEndpoints(
    handler: IFunction,
    resource: RestApi,
    { name, methods, child }: ReasourceType
  ) {
    const lambdaFunction = new LambdaIntegration(handler);
    const rootResource = resource.root.addResource(name);
    methods.map((item) => {
      rootResource.addMethod(item, lambdaFunction);
    });
    return rootResource;
  }
  addChildrenEndpoints(
    path: string,
    methodType: string,
    handler: IFunction,
    resource: aws_apigateway.Resource
  ) {
    const lambdaFunction = new LambdaIntegration(handler);
    const childResource = resource.addResource(path);
    childResource.addMethod(methodType, lambdaFunction);
  }
}
