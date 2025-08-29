// app/api/me/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const token = (req as any).cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}
