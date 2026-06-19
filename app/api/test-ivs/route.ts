import { NextResponse } from "next/server";
import { createIVSChannel } from "@/src/services/ivs-services";

export async function GET() {
  try {
    const channel = await createIVSChannel(
      "test-channel"
    );

    return NextResponse.json(channel);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}
