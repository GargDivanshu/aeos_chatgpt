import { db } from "@/lib/db";
import { messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export const POST = async (req: Request) => {
  const { conversationsId } = await req.json();
  const _messages = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationsId));
  return NextResponse.json(_messages);
};
