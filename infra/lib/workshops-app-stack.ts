// Lambda: Obtener taller por ID (público)
const getWorkshopFn = new lambda.Function(this, 'GetWorkshopFn', {
  runtime: lambda.Runtime.NODEJS_20_X,
  architecture: lambda.Architecture.ARM_64,
  handler: 'index.handler',
  code: lambda.Code.fromAsset('lambdas/get-workshop'),
  environment: { TABLE_NAME: table.tableName },
  timeout: cdk.Duration.seconds(10),
  memorySize: 256,
  tracing: lambda.Tracing.ACTIVE,
});

table.grantReadData(getWorkshopFn);