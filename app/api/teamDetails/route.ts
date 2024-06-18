import { db } from '@/lib/db';
import { teams, conversations, teamMembers, users } from '@/lib/db/schema';
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
        const { teamId, user_id } = body;

        // Fetch the team details
        const teamDetails = await db.select()
            .from(teams)
            .where(eq(teams.id, teamId))
            .execute();

        if (teamDetails.length === 0) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        const team = teamDetails[0];

        // Fetch the owner details
        const ownerDetails = await db.select()
            .from(users)
            .where(eq(users.id, team.ownerId))
            .execute();

        const ownerName = ownerDetails.length > 0 ? ownerDetails[0].name : "Unknown";
        const ownerEmail = ownerDetails.length > 0 ? ownerDetails[0].email : "Unknown";

        // Check if the user is a member or owner of the team
        let userRole = null;
        if (team.ownerId === user_id) {
            userRole = "Owner";
        } else {
            const memberDetails = await db.select()
                .from(teamMembers)
                .where(eq(teamMembers.teamId, teamId))
                .where(eq(teamMembers.userId, user_id))
                .execute();

            if (memberDetails.length > 0) {
                userRole = memberDetails[0].role;
            }
        }

        if (!userRole) {
            return NextResponse.json({ error: "User not authorized to access this team" }, { status: 403 });
        }

        // Fetch the team members and their names and emails
        const memberDetails = await db.select({
                userId: teamMembers.userId,
                userName: users.name,
                userEmail: users.email
            })
            .from(teamMembers)
            .leftJoin(users, eq(teamMembers.userId, users.id))
            .where(eq(teamMembers.teamId, teamId))
            .where(eq(teamMembers.role, 'Member'))
            .execute();

        const memberNames = memberDetails.map(member => member.userName);
        const memberEmails = memberDetails.map(member => member.userEmail);

        // Fetch the conversations associated with the team
        const conversationsDetails = await db.select()
            .from(conversations)
            .where(eq(conversations.teamId, teamId))
            .execute();

        const formattedConversations = conversationsDetails.map(convo => ({
            id: convo.id,
            content: convo.content
        }));

        // const formattedMembers = 

        // Construct the response
        const response = {
            ownerName,
            ownerEmail,
            members: memberNames,
            memberEmails,
            conversations: formattedConversations,
            role: userRole
        };

        return NextResponse.json(response);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    return new Response("Unauthorized", { status: 401 });
}