import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { link } = (await req.json()) as { link?: string };

    if (!link) {
      return NextResponse.json(
        { online: false, message: "Link is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(link);
    } catch {
      return NextResponse.json(
        { online: false, message: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Check if the website is reachable
    try {
      const response = await fetch(link, { method: "HEAD" });
      return NextResponse.json({ online: response.ok });
    } catch {
      return NextResponse.json({ online: false });
    }
  } catch {
    return NextResponse.json(
      { online: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
