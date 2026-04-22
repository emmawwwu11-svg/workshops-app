import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Construct } from 'constructs';

export class WorkshopsAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Usar el nombre del stack para determinar el entorno
const isProd = this.stackName.includes('Prod');
const env = isProd ? 'prod' : (this.node.tryGetContext('env') || 'dev');

    // ========== DYNAMODB ==========
    const table = new dynamodb.Table(this, 'WorkshopsTable', {
      tableName: `workshops-${env}`,
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecoverySpecification: {
        pointInTimeRecoveryEnabled: true,
      },
      removalPolicy: env === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    table.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ========== SNS TOPIC ==========
    const notificationTopic = new sns.Topic(this, 'NotificationTopic', {
      topicName: `workshop-notifications-${env}`,
      displayName: 'Workshop Notifications'
    });

    // ========== EVENTBRIDGE ==========
    const eventBus = new events.EventBus(this, 'WorkshopEventBus', {
      eventBusName: `workshop-bus-${env}`,
    });

    // ========== COGNITO ==========
    const userPool = new cognito.UserPool(this, 'WorkshopUserPool', {
      userPoolName: `workshops-${env}`,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        email: { required: true, mutable: true },
        givenName: { required: true, mutable: true },
        familyName: { required: true, mutable: true },
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      removalPolicy: env === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = userPool.addClient('WebClient', {
      userPoolClientName: `workshops-web-${env}`,
      authFlows: {
        userPassword: true,
        userSrp: true,
      },
    });

    new cognito.CfnUserPoolGroup(this, 'AdminGroup', {
      userPoolId: userPool.userPoolId,
      groupName: 'admin',
    });

    // ========== LAMBDAS ==========
    
    // Lambda: Listar talleres (público)
    const listWorkshopsFn = new lambda.Function(this, 'ListWorkshopsFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambdas/list-workshops'),
      environment: { TABLE_NAME: table.tableName },
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
    });

    // Lambda: Crear taller (admin)
    const createWorkshopFn = new lambda.Function(this, 'CreateWorkshopFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambdas/create-workshop'),
      environment: { TABLE_NAME: table.tableName },
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
    });

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

    // Lambda: Actualizar taller (admin)
    const updateWorkshopFn = new lambda.Function(this, 'UpdateWorkshopFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambdas/update-workshop'),
      environment: { TABLE_NAME: table.tableName },
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
    });

    // Lambda: Eliminar taller (admin)
    const deleteWorkshopFn = new lambda.Function(this, 'DeleteWorkshopFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambdas/delete-workshop'),
      environment: { TABLE_NAME: table.tableName },
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
    });

    // Lambda: Registrar estudiante
    const registerStudentFn = new lambda.Function(this, 'RegisterStudentFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambdas/register-student'),
      environment: { 
        TABLE_NAME: table.tableName,
        EVENT_BUS_NAME: eventBus.eventBusName,
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
    });

    // Lambda: Notificadora
    const notificationFn = new lambda.Function(this, 'NotificationFn', {
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambdas/notification-handler'),
      environment: {
        SNS_TOPIC_ARN: notificationTopic.topicArn,
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
      tracing: lambda.Tracing.ACTIVE,
    });

    // ========== PERMISOS ==========
    table.grantReadData(listWorkshopsFn);
    table.grantWriteData(createWorkshopFn);
    table.grantReadData(getWorkshopFn);
    table.grantReadWriteData(updateWorkshopFn);
    table.grantWriteData(deleteWorkshopFn);
    table.grantReadWriteData(registerStudentFn);
    notificationTopic.grantPublish(notificationFn);
    eventBus.grantPutEventsTo(registerStudentFn);

    // ========== REGLA EVENTBRIDGE ==========
    const registrationRule = new events.Rule(this, 'StudentRegistrationRule', {
      eventBus: eventBus,
      eventPattern: {
        source: ['workshops.register'],
        detailType: ['STUDENT_REGISTERED'],
      },
      targets: [new targets.LambdaFunction(notificationFn)],
    });

    // ========== API GATEWAY ==========
    const api = new apigateway.RestApi(this, 'WorkshopsApi', {
      restApiName: `workshops-api-${env}`,
      deployOptions: {
        stageName: env,
        tracingEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'WorkshopAuthorizer', {
      cognitoUserPools: [userPool],
    });

    // Endpoints
    const workshops = api.root.addResource('workshops');
    
    workshops.addMethod('GET', new apigateway.LambdaIntegration(listWorkshopsFn));
    workshops.addMethod('POST', new apigateway.LambdaIntegration(createWorkshopFn), {
      authorizer: authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    const workshopById = workshops.addResource('{id}');
    workshopById.addMethod('GET', new apigateway.LambdaIntegration(getWorkshopFn));
    workshopById.addMethod('PUT', new apigateway.LambdaIntegration(updateWorkshopFn), {
      authorizer: authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });
    workshopById.addMethod('DELETE', new apigateway.LambdaIntegration(deleteWorkshopFn), {
      authorizer: authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    const register = workshopById.addResource('register');
    register.addMethod('POST', new apigateway.LambdaIntegration(registerStudentFn), {
      authorizer: authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    });

    // ========== OUTPUTS ==========
    new cdk.CfnOutput(this, 'TableName', { value: table.tableName });
    new cdk.CfnOutput(this, 'Environment', { value: env });
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'ApiUrl', { value: api.url });
    new cdk.CfnOutput(this, 'EventBusName', { value: eventBus.eventBusName });
    new cdk.CfnOutput(this, 'SNSTopicArn', { value: notificationTopic.topicArn });
  }
}