import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Address from "../../../lib/models/ReceivingAddress";
import { connectDB } from "../../../lib/models/mongodb";

// GET - fetch the single address and tokens
export async function GET() {
  await connectDB();
  const address = await Address.findOne({_id:"68ac2a260cbe27f8b41145f2"});
  return NextResponse.json(address || {});
}

// PUT - create or replace the address and tokens
export async function PUT(req: Request) {
  await connectDB();
  const { receivingAddress, tokens } = await req.json();

  if (!receivingAddress) {
    return NextResponse.json(
      { error: "receivingAddress is required" },
      { status: 400 }
    );
  }

  let address = await Address.findOne();
  if (address) {
    address.address = receivingAddress;
    if (tokens) address.tokens = tokens;
    await address.save();
  } else {
    address = await Address.create({
      address: receivingAddress,
      tokens: tokens || [],
    });
  }

  return NextResponse.json(address);
}

// PATCH - add or update a single token
export async function PATCH(req: Request) {
  await connectDB();
  const { token } = await req.json();

  if (
    !token ||
    !token.name ||
    !token.mint ||
    typeof token.monthlySubscription !== "number" ||
    typeof token.yearlySubscription !== "number" ||
    typeof token.oneTimeSubscription !== "number"
  ) {
    return NextResponse.json(
      { error: "token must include name, mint, monthlySubscription, yearlySubscription, and oneTimeSubscription" },
      { status: 400 }
    );
  }

  // Find the single address record
  let address = await Address.findOne();
  if (!address) {
    // If no address exists, create a new one with this token
    address = await Address.create({
      address: "default-address",
      tokens: [token],
    });
  } else {
    // Check if token with same mint exists
    const existingIndex = address.tokens.findIndex((t) => t.mint === token.mint);
    if (existingIndex >= 0) {
      address.tokens[existingIndex] = token; // update
    } else {
      address.tokens.push(token); // add new
    }
    await address.save();
  }

  return NextResponse.json(address);
}

// DELETE - remove a token by mint
export async function DELETE(req: Request) {
  await connectDB();
  const { mint } = await req.json();

  if (!mint) {
    return NextResponse.json(
      { error: "mint is required to delete a token" },
      { status: 400 }
    );
  }

  const address = await Address.findOne();
  if (!address) {
    return NextResponse.json({ error: "No address found" }, { status: 404 });
  }

  address.tokens = address.tokens.filter((t) => t.mint !== mint);
  await address.save();

  return NextResponse.json(address);
}
