// pages/api/getUser.ts
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const { getUser } = getKindeServerSession();
    const authUser = await getUser();

    if (!authUser) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const dbUser = await db.select().from(users).where(eq(users.email, authUser.email)).execute();

    if (!dbUser || dbUser.length === 0) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(dbUser[0]);
}
