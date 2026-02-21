import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, bucket, whopUserId } = body;

    // Validate required fields
    if (!bucket) {
      return NextResponse.json(
        { error: "Missing required field: bucket" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.GHL_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("GHL_WEBHOOK_URL is not set");
      return NextResponse.json(
        { error: "Webhook URL not configured" },
        { status: 500 }
      );
    }

    // Send data to GoHighLevel inbound webhook
    const ghlPayload = {
      name: name || "",
      email: email || "",
      bucket: bucket,
      whop_user_id: whopUserId || "",
      source: "whop_onboarding",
      timestamp: new Date().toISOString(),
    };

    const ghlResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ghlPayload),
    });

    if (!ghlResponse.ok) {
      console.error(
        "GHL webhook failed:",
        ghlResponse.status,
        await ghlResponse.text()
      );
      // Still return success to the user — we don't want to block their onboarding
      // The webhook failure will be logged and can be retried
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in tag-lead API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
