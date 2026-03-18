"use strict";

const path = require("node:path");
const cdk = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda");

class WebStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const webFunction = new lambda.Function(this, "WebFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "src/handler.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "../../../apps/web"), {
        exclude: [
          "README.md",
          "scripts",
          "tests"
        ]
      }),
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        NODE_ENV: "production"
      }
    });

    const functionUrl = webFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE
    });

    new cdk.CfnOutput(this, "FunctionUrl", {
      value: functionUrl.url
    });
  }
}

module.exports = {
  WebStack
};
