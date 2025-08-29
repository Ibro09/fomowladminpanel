import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email === "test@example.com" && password === "password") {
    const response = NextResponse.json({ success: true });

    // ✅ Set secure HttpOnly cookie
    response.cookies.set("token", "mysecrettoken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
