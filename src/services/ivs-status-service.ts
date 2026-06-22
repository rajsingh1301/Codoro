import { ListStreamsCommand } from "@aws-sdk/client-ivs";
import { ivsClient } from "@/src/lib/ivs/client";

export async function getIVSStreamStatus(
  channelArn: string
) {
  const result = await ivsClient.send(
    new ListStreamsCommand({})
  );

  const isLive =
    result.streams?.some(
      (stream) =>
        stream.channelArn === channelArn
    ) ?? false;

  return isLive ? "LIVE" : "OFFLINE";
}