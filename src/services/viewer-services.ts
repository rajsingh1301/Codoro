import {
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import { docClient } from "@/src/lib/dynamodb/client";

export async function incrementViewerCount(
  streamId: string
) {
  await docClient.send(
    new UpdateCommand({
      TableName: "streams",

      Key: {
        streamId,
      },

      UpdateExpression:
        "SET viewCount = if_not_exists(viewCount, :zero) + :inc",

      ExpressionAttributeValues: {
        ":zero": 0,
        ":inc": 1,
      },
    })
  );
}