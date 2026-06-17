import { NextResponse } from "next/server";
import { askAI } from "@/src/services/ai-services";

export async function POST(request: Request) {
  try {
    const {
      question,
      code,
      streamTitle,
      streamDescription,
    } = await request.json();

    console.log("AI API Request:", {
      question,
      code,
      streamTitle,
      streamDescription,
    });

    const response = await askAI(
      question,
      code,
      streamTitle,
      streamDescription
    );

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error("AI ROUTE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to get AI response",
      },
      {
        status: 500,
      }
    );
  }
}