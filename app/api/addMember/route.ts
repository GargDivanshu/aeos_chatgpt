import { db } from '@/lib/db';
import { conversations, teamMembers } from '@/lib/db/schema';
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

export async function POST(req: Request, res: Response) {
    const { getUser, isAuthenticated } = getKindeServerSession();
    const user = await getUser();
    const isAuth = isAuthenticated();

    if (!isAuth) {
        return NextResponse.redirect('/');
    }

    try {
        const { email, teamId } = req.body;
        // if (!email) {
        //   return NextResponse.json({ error: 'Email is required' }, { status: 400 }); // Changed to 400 for bad request
        // }

        // Find the user by email
        const userQuery = db.select().from(users).where(eq(users.email, email));
        const userResult = await userQuery.execute();
        if (userResult.length === 0) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 }); // Changed to 404 for not found
        }

        const userId = userResult[0].id;

        // Prepare the data for inserting into the teamMembers table
        const newMember = {
          teamId: teamId,
          userId: userId,
          role: 'Member',
        };

        console.log('Attempting to insert new member:', newMember); // Log the data being inserted

        // Insert the new member into the teamMembers table
        const insertResult = await db.insert(teamMembers).values(newMember).execute();

        if (insertResult.rowCount > 0) {
            console.log('Member added successfully'); // Log success
            return NextResponse.json({ message: 'Member added successfully' }, { status: 201 }); // Changed to 201 for created
        } else {
            console.log('Failed to add member'); // Log failure
            return NextResponse.json({ error: 'Failed to add member' }, { status: 500 }); // Keep 500 for internal server error
        }
    } catch (error) {
        console.error('Error:', error); // Log the error
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 }); // Keep 500 for internal server error
    }
}
