import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  QueryCommand
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async () => {

  try {

    // Get all events
    const eventsData = await dynamo.send(
      new ScanCommand({
        TableName: "Events"
      })
    );

    const events = eventsData.Items || [];

    // For each event calculate registrations
    const eventsWithSeats = await Promise.all(
      events.map(async (event) => {

        const registrations = await dynamo.send(
          new QueryCommand({
            TableName: "Registrations",
            IndexName: "eventId-index",
            KeyConditionExpression: "eventId = :e",
            ExpressionAttributeValues: {
              ":e": event.eventsId
            }
          })
        );

        const registered = registrations.Items.length;

        const capacity = event.Capacity || 0;

        const seatsRemaining = capacity - registered;

        return {
          ...event,
          capacity,
          registered,
          seatsRemaining
        };

      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(eventsWithSeats)
    };

  } catch (error) {

    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: "Error loading events"
      })
    };

  }

};