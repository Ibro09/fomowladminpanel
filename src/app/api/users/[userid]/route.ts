import { NextRequest, NextResponse } from "next/server";
import User from "../../../../lib/models/User";   // your Mongoose User model
import { connectDB } from "../../../../lib/models/mongodb";


// PUT /api/users/:userId
export async function PUT(req: NextRequest, context: { params: { userid: string } })  {
  await connectDB();
  const { params } = context;
  // In Next.js App Router, params can be a Promise in some versions
  const resolvedParams = await params; // await it
  const useridStr = resolvedParams.userid;

  if (!useridStr) {
        console.error("userId is not there:", useridStr);

    return NextResponse.json({ message: "userId missing" }, { status: 400 });}

  // Convert to number if your schema uses Number
  const userIdNum =  Number(resolvedParams.userid);
  if (isNaN(userIdNum)) {
    console.error("userId is not a number:", params.userid);
    return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
  }

  const body = await req.json();
  const { premium } = body;

  const updatedUser = await User.findOneAndUpdate(
    { userId: userIdNum },
    { premium },
    { new: true }
  );

  if (!updatedUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json(updatedUser);
}


// DELETE /api/users/:userId
export async function DELETE(req: NextRequest, context: { params: { userid: string } }) {
  const { params } = context;
  // In Next.js App Router, params can be a Promise in some versions
  const resolvedParams = await params; // await it
  const useridStr = resolvedParams.userid;

  if (!useridStr) {
    return NextResponse.json({ message: "userid missing" }, { status: 400 });
  }

  await connectDB();

  const deletedUser = await User.findOneAndDelete({ userId: useridStr }); // query as string
  if (!deletedUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json({ message: "User deleted" });
}
