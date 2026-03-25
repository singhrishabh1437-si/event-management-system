import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {

  try {

    const body = JSON.parse(event.body);
    const { eventId, name, email } = body;

    if (!eventId || !name || !email) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Missing required fields" })
      };
    }

    // Get event from Events table
    const eventData = await dynamo.send(
      new GetCommand({
        TableName: "Events",
        Key: { eventsId: eventId }
      })
    );

    if (!eventData.Item) {
      return {
        statusCode: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Event not found" })
      };
    }

    // Read event capacity
    const capacity = eventData.Item.Capacity || 0;

    // Get number of registrations for this event
    const registrations = await dynamo.send(
      new QueryCommand({
        TableName: "Registrations",
        IndexName: "eventId-index",
        KeyConditionExpression: "eventId = :eventId",
        ExpressionAttributeValues: {
          ":eventId": eventId
        }
      })
    );

    const registeredCount = registrations.Items ? registrations.Items.length : 0;

    // Check if event is full
    if (registeredCount >= capacity) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ message: "Event is full" })
      };
    }

    // Save registration
    await dynamo.send(
      new PutCommand({
        TableName: "Registrations",
        Item: {
          registrationId: Date.now().toString(),
          eventId,
          name,
          email
        }
      })
    );

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Registration successful" })
    };

  } catch (error) {

    console.log(error);

    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Internal server error" })
    };
  }
};