import { NextResponse } from "next/server";
import { generateStreamSummary } from "@/src/services/ai-services";

export async function POST(request: Request) {
  try {
    const { streamTitle, streamDescription } =
      await request.json();

    const summary = await generateStreamSummary(
      streamTitle,
      streamDescription
    );

    return NextResponse.json({
      summary,
    });
  } catch (error) {
    console.error("SUMMARY ROUTE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
