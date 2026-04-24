const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");

const snsClient = new SNSClient({});
const topicArn = process.env.SNS_TOPIC_ARN;

exports.handler = async (event) => {
  console.log('Evento recibido:', JSON.stringify(event));
  
  for (const record of event.Records) {
    const detail = JSON.parse(record.detail);
    
    const message = `Nuevo registro en taller: ${detail.workshopName}\n\nEstudiante: ${detail.userEmail}\nTaller ID: ${detail.workshopId}\nFecha: ${detail.registeredAt}`;
    
    await snsClient.send(new PublishCommand({
      TopicArn: topicArn,
      Subject: `Nuevo registro: ${detail.workshopName}`,
      Message: message
    }));
  }
  
  return { statusCode: 200 };
};
