import { NextRequest, NextResponse } from "next/server";
import User from "../../../../lib/models/User";   // your Mongoose User model
import { connectDB } from "../../../../lib/models/mongodb";

// PUT /api/users/:userId
export async function PUT(
  req: NextRequest,
  context: { params: { userid: string } } | any   // allow both object and Promise
) {
  await connectDB();

  // Some Next.js versions wrongly infer params as Promise
  const resolvedParams = await Promise.resolve(context.params);
  const useridStr = resolvedParams.userid;

  if (!useridStr) {
    console.error("userId is not there:", useridStr);
    return NextResponse.json(
      { message: "userId missing" },
      { status: 400 }
    );
  }

  // Convert to number if your schema uses Number
  const userIdNum = Number(useridStr);
  if (isNaN(userIdNum)) {
    console.error("userId is not a number:", useridStr);
    return NextResponse.json(
      { message: "Invalid userId" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { premium } = body;

  const updatedUser = await User.findOneAndUpdate(
    { userId: userIdNum },
    { premium },
    { new: true }
  );

  if (!updatedUser) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedUser);
}

// DELETE /api/users/:userId
export async function DELETE(
  req: NextRequest,
  context: { params: { userid: string } } | any   // same flexible typing
) {
  // Resolve params safely
  const resolvedParams = await Promise.resolve(context.params);
  const useridStr = resolvedParams.userid;

  if (!useridStr) {
    return NextResponse.json(
      { message: "userid missing" },
      { status: 400 }
    );
  }

  await connectDB();

  // If schema expects Number, cast here
  const userIdNum = Number(useridStr);
  const query = isNaN(userIdNum) ? { userId: useridStr } : { userId: userIdNum };

  const deletedUser = await User.findOneAndDelete(query);

  if (!deletedUser) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "User deleted" });
}
