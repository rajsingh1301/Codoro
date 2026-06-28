import { CreateChannelCommand, DeleteChannelCommand } from "@aws-sdk/client-ivs";
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

export async function deleteIVSChannel(channelArn: string) {
    try {
        const command = new DeleteChannelCommand({
            arn: channelArn,
        });
        await ivsClient.send(command);
        console.log("SUCCESSFULLY DELETED IVS CHANNEL:", channelArn);
    } catch (error) {
        console.error("FAILED TO DELETE IVS CHANNEL:", channelArn, error);
    }
}