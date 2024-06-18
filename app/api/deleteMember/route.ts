import { db } from '@/lib/db';
import { teamMembers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { getUser, isAuthenticated } = getKindeServerSession();
    const user = await getUser();
    const isAuth = isAuthenticated();

    if (!isAuth) {
        return NextResponse.redirect('/');
    }

    try {
        const body = await req.json();
        const { memberId, teamId } = body;

        if (!memberId || !teamId) {
            return NextResponse.json({ error: 'Member ID and Team ID are required' }, { status: 400 });
        }

        // Delete the member from the teamMembers table
        const deleteResult = await db.delete(teamMembers)
            .where(eq(teamMembers.userId, memberId))
            .where(eq(teamMembers.teamId, teamId))
            .execute();

        if (deleteResult.rowCount > 0) {
            return NextResponse.json({ message: 'Member deleted successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Member not found or already deleted' }, { status: 404 });
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    return new Response("Unauthorized", { status: 401 });
}
