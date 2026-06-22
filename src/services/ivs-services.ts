import { CreateChannelCommand } from "@aws-sdk/client-ivs";
import { ivsClient } from "@/src/lib/ivs/client";

export async function createIVSChannel(name: string) {
    const safeName = name

        .replace(/[^a-zA-Z0-9-_]/g, "-")

        .toLowerCase();

    const command = new CreateChannelCommand({

        name: safeName,

        latencyMode: "LOW",

        type: "STANDARD",

    });

    const response = await ivsClient.send(command);

    return {
        channelArn: response.channel?.arn,
        playbackUrl: response.channel?.playbackUrl,
        streamKey: response.streamKey?.value,
    };
}