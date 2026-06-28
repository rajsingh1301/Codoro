import { NextResponse } from "next/server";

import { getStreamById, updateStreamStatus } from "@/src/services/streams-services";
import { getIVSStreamStatus } from "@/src/services/ivs-status-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ streamId: string }> }
) {
  const { streamId } = await params;

  const stream = await getStreamById(streamId);

  if (!stream) {
    return NextResponse.json(
      {
        error: "Stream not found",
      },
      {
        status: 404,
      }
    );
  }

  // Fetch the actual streaming state from AWS IVS
  let ivsStatus = "OFFLINE";
  try {
    ivsStatus = await getIVSStreamStatus(stream.channelArn); // "LIVE" or "OFFLINE"
  } catch (err) {
    console.error("Failed to fetch IVS stream status from AWS:", err);
  }
  let currentStatus = stream.status; // "OFFLINE", "LIVE", or "ENDED"

  if (ivsStatus === "LIVE" && currentStatus !== "LIVE") {
    await updateStreamStatus(streamId, "LIVE");
    currentStatus = "LIVE";
  } else if (ivsStatus === "OFFLINE" && currentStatus === "LIVE") {
    await updateStreamStatus(streamId, "ENDED");
    currentStatus = "ENDED";
  }

  return NextResponse.json({
    status: currentStatus,
  });
}