import * as cdk from '@aws-cdk/core';
import * as dynamoDb from '@aws-cdk/aws-dynamodb';
import { RestApi, LambdaIntegration } from "@aws-cdk/aws-apigateway";
import * as lambda from '@aws-cdk/aws-lambda';

const TABLE = 'stuff';
const PRIMARY_KEY = 'id';

export class IntroToAwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamoDb.Table(this, TABLE, {
      partitionKey: {
        name: PRIMARY_KEY,
        type: dynamoDb.AttributeType.STRING
      },
      tableName: TABLE,
      removalPolicy: cdk.RemovalPolicy.DESTROY // destroy the table after cdk stack is destroyed
    });

    const getStuffHandler = new lambda.Function(this, 'GetStuffs', {
      code: new lambda.AssetCode('lib/lambda'),
      handler: 'get-stuff.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE
      }
    });
    const addStuffHandler = new lambda.Function(this, 'AddStuff', {
      code: new lambda.AssetCode('lib/lambda'),
      handler: 'add-stuff.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE,
        PRIMARY_KEY
      }
    });

    const api = new RestApi(this, 'StuffApi');
    const stuff = api.root.addResource('stuff');
    stuff.addMethod('GET', new LambdaIntegration(getStuffHandler));
    stuff.addMethod('POST', new LambdaIntegration(addStuffHandler));

    table.grantReadData(getStuffHandler);
    table.grantReadWriteData(addStuffHandler);
  }
}
