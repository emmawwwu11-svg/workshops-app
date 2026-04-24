const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const tableName = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    const { name, description, category, location, startAt, endAt, capacity } = JSON.parse(event.body);
    const workshopId = `WORKSHOP#${Date.now()}`;
    const now = new Date().toISOString();

    const item = {
      PK: workshopId,
      SK: 'META',
      GSI1PK: 'WORKSHOP#ALL',
      GSI1SK: startAt,
      name,
      description,
      category,
      location,
      startAt,
      endAt,
      capacity: parseInt(capacity),
      status: 'scheduled',
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({ TableName: tableName, Item: item }));

    return {
      statusCode: 201,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Taller creado exitosamente', workshopId: workshopId, workshop: item })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Error al crear el taller', error: error.message })
    };
  }
};
