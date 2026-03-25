import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {

try {

const body = JSON.parse(event.body);

const title = body.title;
const date = body.date;
const description = body.description;
const capacity = body.capacity;
const category = body.category;

const eventId = Date.now().toString();

await dynamo.send(

new PutCommand({

TableName: "Events",

Item: {

eventsId: eventId,
title: title,
date: date,
description: description,
Capacity: Number(capacity),
category: category

}

})

);

return {

statusCode: 200,

headers: {

"Access-Control-Allow-Origin": "*",
"Access-Control-Allow-Methods": "GET,POST,OPTIONS",
"Access-Control-Allow-Headers": "Content-Type"

},

body: JSON.stringify({

message: "Event created successfully"

})

};

}

catch (error) {

return {

statusCode: 500,

headers: {

"Access-Control-Allow-Origin": "*"

},

body: JSON.stringify({

message: "Error creating event",
error: error.message

})

};

}

};