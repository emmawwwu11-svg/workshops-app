const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    if (!id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ message: 'ID del taller requerido' })
      };
    }

    const body = JSON.parse(event.body);
    const now = new Date().toISOString();

    let updateExpression = 'SET updatedAt = :updatedAt';
    const expressionValues = { ':updatedAt': now };
    const expressionNames = {};

    const allowedFields = ['name', 'description', 'category', 'location', 'startAt', 'endAt', 'capacity', 'status'];
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateExpression += `, #${field} = :${field}`;
        expressionNames[`#${field}`] = field;
        expressionValues[`:${field}`] = body[field];
      }
    }

    const params = {
      TableName: tableName,
      Key: { PK: `WORKSHOP#${id}`, SK: 'META' },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: 'ALL_NEW'
    };

    const response = await docClient.send(new UpdateCommand(params));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Taller actualizado', workshop: response.Attributes })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Error interno', error: error.message })
    };
  }
};
