// /pages/api/createTeam.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/db';
import { teams, conversations, teamMembers, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not Allowed' }, { status: 405 });
    return;
  }

  const { team_name, owner_id, conversation_name } = req.body;

  if (!team_name || !owner_id || !conversation_name) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    return;
  }

  try {
    const db_user = await db.select(users)
      .from(users)
      .where(eq(users.id, owner_id))
      .execute();

    if (db_user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
      return;
    }

    if (db_user[0].balance === 0) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
      return;
    }

    const created_team = await db.insert(teams).values({
      name: team_name,
      ownerId: owner_id,
    }).returning({ id: teams.id, name: teams.name }).execute();

    if (created_team.length === 0) {
      throw new Error('Failed to create team');
    }

    const created_team_data = created_team[0];

    const default_chat = await db.insert(conversations).values({
      content: conversation_name,
      userId: owner_id,
      teamId: created_team_data.id,
    }).returning({ id: conversations.id, content: conversations.content }).execute();

    if (default_chat.length === 0) {
      throw new Error('Failed to create default conversation');
    }

    await db.update(users)
      .set({ balance: db_user[0].balance - 1 })
      .where(eq(users.id, owner_id))
      .execute();

    const owner_team = await db.insert(teamMembers).values({
      teamId: created_team_data.id,
      userId: owner_id,
      role: 'Owner'
    }).returning({ id: teamMembers.id }).execute();

    if (owner_team.length === 0) {
      throw new Error('Failed to add team member');
    }

    return NextResponse.json({
        team: { id: created_team_data.id, name: created_team_data.name },
        conversation: { id: default_chat[0].id, name: default_chat[0].content }
      }, { status: 200 });

  } catch (error) {
    console.error(error);
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
