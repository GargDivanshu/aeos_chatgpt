import { db } from '@/lib/db';
import { conversations } from '@/lib/db/schema';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from 'next/server';
import {eq} from 'drizzle-orm'

export async function POST(req: Request) {
    const { getUser, isAuthenticated } = getKindeServerSession();
    const user = await getUser();
    const isAuth = isAuthenticated();

    if (!isAuth) {
        return NextResponse.redirect('/');
    }

    try {
        const body = await req.json();
        const { teamId, conversation_title } = body;

        if (!teamId || !conversation_title) {
            return NextResponse.json({ error: "Missing teamId or conversation_title" }, { status: 400 });
        }

        const conversationCount = await db.count()
            .from(conversations)
            .where(eq(conversations.teamId, teamId))
            .execute();

        if (conversationCount >= 5) {
            return NextResponse.json({ error: "Team can have a max of 5 conversations" }, { status: 400 });
        }

        // Insert new conversation
        const [newConversation] = await db.insert(conversations).values({
            teamId,
            content: conversation_title,
            // userId: user.id
        }).returning({ id: conversations.id, content: conversations.content });

        // Fetch updated list of conversations
        const conversationsList = await db.select({ id: conversations.id, content: conversations.content })
            .from(conversations)
            .where(eq(conversations.teamId, teamId))
            .execute();

        return NextResponse.json(conversationsList);
    } catch (err) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
