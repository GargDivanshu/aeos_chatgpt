// import { Configuration, OpenAIApi } from "openai-edge";
import { openai } from '@ai-sdk/openai';
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { conversations, messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { OpenAIStream, StreamingTextResponse, streamText } from "ai";

// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(config);

// export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages: userMessages, conversationsId } = await req.json();

    // Verify the conversation exists
    const conversation = await db.select().from(conversations).where(eq(conversations.id, conversationsId)).execute();
    if (conversation.length !== 1) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const lastUserMessage = userMessages[userMessages.length - 1];

    // Construct prompt for OpenAI
    const prompt = {
      role: "system",
      content: `AI assistant is a powerful, human-like AI. The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness. AI is always friendly, kind, and inspiring, and provides thoughtful responses to the user.`,
    };

    const response = await streamText({
      model: openai('gpt-3.5-turbo'),
      messages: [
        prompt,
        ...userMessages.filter((message) => message.role === "user"),
      ],
      async onFinish(completion: string) {
        await db.insert(messages).values({
          conversationId: conversationsId,
          content: lastUserMessage.content,
          role: "user",
        }).execute();

        await db.insert(messages).values({
          conversationId: conversationsId,
          content: completion.text,
          role: "system",
        }).execute();
      }
      // stream: true,
    });

    return response.toAIStreamResponse();

    // Create a stream for OpenAI response
    // const stream = OpenAIStream(response, {
    //   onStart: async () => {
    //     // Save the user's message to the database
    //     await db.insert(messages).values({
    //       conversationId: conversationsId,
    //       content: lastUserMessage.content,
    //       role: "user",
    //     }).execute();
    //   },
    //   onCompletion: async (completion: string) => {
    //     // Save the AI's response to the database
    //     await db.insert(messages).values({
    //       conversationId: conversationsId,
    //       content: completion,
    //       role: "system",
    //     }).execute();
    //   },
    // });


    // return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
