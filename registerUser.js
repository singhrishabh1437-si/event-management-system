import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const { email, password } = body;

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email and password required" })
      };
    }

    await dynamo.send(
      new PutCommand({
        TableName: "Users",
        Item: {
          userId: Date.now().toString(),
          email: email,
          password: password,
          role: "user"
        }
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User registered successfully" })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
