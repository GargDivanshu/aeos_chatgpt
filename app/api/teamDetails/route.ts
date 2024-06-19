import { db } from '@/lib/db';
import { teams, conversations, teamMembers, users } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
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

        console.log(JSON.stringify(teamDetails) + " :teamDetails");

        if (teamDetails.length === 0) {
            return NextResponse.json({ error: "Team not found" }, { status: 404 });
        }

        const team = teamDetails[0];
        const team_name = teamDetails[0].name; 

        // Fetch the owner details
        const ownerDetails = await db.select()
            .from(users)
            .where(eq(users.id, team.ownerId))
            .execute();

        console.log(JSON.stringify(ownerDetails) + " :ownerDetails");

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

            console.log(JSON.stringify(memberDetails) + " :memberDetails");

            if (memberDetails.length > 0) {
                userRole = memberDetails[0].role;
            }
        }

        if (!userRole) {
            return NextResponse.json({ error: "User not authorized to access this team" }, { status: 403 });
        }

        // Fetch the team members and their names and emails
        const allMemberDetails = await db.select()
            .from(teamMembers)
            .where(eq(teamMembers.teamId, teamId))
            .execute();

        console.log(JSON.stringify(allMemberDetails) + " :allMemberDetails");

        const userIds = allMemberDetails.map(member => member.userId);

        let formattedMembers = [];
        if (userIds.length > 0) {
            const userDetails = await db.select({
                id: users.id,
                name: users.name,
                email: users.email
            })
            .from(users)
            .where(inArray(users.id, userIds))
            .execute();

            console.log(JSON.stringify(userDetails) + " :userDetails");

            formattedMembers = userDetails
                .filter(user => user.id !== team.ownerId) // Ensure the owner is not included
                .map(user => ({
                    id: user.id,
                    name: user.name,
                    email: user.email
                }));
        }

        // Fetch the conversations associated with the team
        const conversationsDetails = await db.select()
            .from(conversations)
            .where(eq(conversations.teamId, teamId))
            .execute();

        console.log(JSON.stringify(conversationsDetails) + " :conversationsDetails");

        const formattedConversations = conversationsDetails.map(convo => ({
            id: convo.id,
            content: convo.content
        }));

        // Construct the response
        const response = {
            teamId,
            team_name,
            ownerName,
            ownerEmail,
            members: formattedMembers,
            conversations: formattedConversations,
            role: userRole
        };

        console.log(JSON.stringify(response) + " :teamDetails -- response");

        return NextResponse.json(response);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    return new Response("Unauthorized", { status: 401 });
}
