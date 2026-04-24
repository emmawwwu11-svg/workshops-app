const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { EventBridgeClient, PutEventsCommand } = require("@aws-sdk/client-eventbridge");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const eventBridgeClient = new EventBridgeClient({});
const tableName = process.env.TABLE_NAME;
const eventBusName = process.env.EVENT_BUS_NAME;

exports.handler = async (event) => {
  try {
    const workshopId = event.pathParameters?.id;
    const userId = event.requestContext.authorizer.claims.sub;
    const userEmail = event.requestContext.authorizer.claims.email;

    const workshopResult = await docClient.send(new GetCommand({
      TableName: tableName,
      Key: { PK: `WORKSHOP#${workshopId}`, SK: 'META' }
    }));
    const workshopName = workshopResult.Item?.name || 'Taller';

    await docClient.send(new PutCommand({
      TableName: tableName,
      Item: {
        PK: `WORKSHOP#${workshopId}`,
        SK: `REG#${userId}`,
        userId: userId,
        userEmail: userEmail,
        registeredAt: new Date().toISOString(),
        status: 'confirmed'
      }
    }));

    await eventBridgeClient.send(new PutEventsCommand({
      Entries: [{
        Source: 'workshops.register',
        DetailType: 'STUDENT_REGISTERED',
        Detail: JSON.stringify({ workshopId, workshopName, userId, userEmail, registeredAt: new Date().toISOString() }),
        EventBusName: eventBusName
      }]
    }));

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Registro exitoso', workshopId, workshopName })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Error interno', error: error.message })
    };
  }
};
