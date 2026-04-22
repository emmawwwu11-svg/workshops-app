const api = new apigateway.RestApi(this, 'WorkshopsApi', {
  restApiName: `workshops-api-${env}`,
  deployOptions: {
    stageName: env,
    tracingEnabled: true,
  },
  defaultCorsPreflightOptions: {
    allowOrigins: apigateway.Cors.ALL_ORIGINS,
    allowMethods: apigateway.Cors.ALL_METHODS,
    allowHeaders: ['Content-Type', 'Authorization', 'X-Amz-Date', 'X-Api-Key'],
  },
});