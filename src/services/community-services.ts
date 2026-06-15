import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@/src/lib/dynamodb/client";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

const docClient = DynamoDBDocumentClient.from(dynamoClient);
 // Create a new community in the database
export async function createCommunityInDB(data: {
  communityId: string;
  name: string;
  description: string;
  createdBy: string;
}) {
  await docClient.send(
    new PutCommand({
      TableName: "communities",
      Item: {
        ...data,
        createdAt: new Date().toISOString(),
      },
    })
  );
}
 
 // Get all communities from the database
export async function getCommunities() {

  const result = await docClient.send(

    new ScanCommand({

      TableName: "communities",

    })

  );

  return result.Items ?? [];

}

//get all communities by id 
export async function getCommunityById(
  communityId: string
) {
  const result = await docClient.send(
    new GetCommand({
      TableName: "communities",
      Key: {
        communityId,
      },
    })
  );

  return result.Item;
}