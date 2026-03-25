import AWS from "aws-sdk";

const dynamo = new AWS.DynamoDB.DocumentClient();

export const handler = async (event) => {
  try {
    const params = {
      TableName: "Registrations" // your table name
    };

    const data = await dynamo.scan(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};