"use server";
import { db } from '@/lib/db';
import { teams, conversations, teamMembers, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function createTeam(team_name: string, owner_id: string, conversation_name: string) {
  // const team_name = formData?.get('team_name') as string;
  // const owner_id = parseInt(formData?.get('owner_id') as string, 10);
  // const conversation_name = formData?.get('conversation_name') as string;

  if (!team_name || isNaN(owner_id)) {
    throw new Error('Invalid team name or owner ID');
  }

  // Fetch the user from the database
  const db_user = await db.select(users)
    .from(users)
    .where(eq(users.id, owner_id))
    .execute();


  if (db_user.length === 0) {
    throw new Error('User not found');
  }

  if (db_user[0].balance === 0) {
    return { error: 'Insufficient credits' };
  }

  // Insert the team and return the created team
  const created_team = await db.insert(teams).values({
    name: team_name,
    ownerId: owner_id,
  }).returning({id: teams.id}).execute();


  // Ensure created_team is not empty
  if (created_team.length === 0) {
    throw new Error('Failed to create team');
  }

  // Extract the created team data
  const created_team_data = created_team[0];

  // Insert the default conversation
  const default_chat = await db.insert(conversations).values({
    content: conversation_name,
    userId: owner_id,
    teamId: created_team_data.id,
  }).returning({id: conversations.id}).execute();


  // Ensure default_chat is not empty
  if (default_chat.length === 0) {
    throw new Error('Failed to create default conversation');
  }

  // Update the user's balance
  await db.update(users)
    .set({
      balance: db_user[0].balance - 1
    })
    .where(eq(users.id, owner_id))
    .execute();

  // Insert the owner team member
  const owner_team = await db.insert(teamMembers).values({
    teamId: created_team_data.id,
    userId: owner_id,
    role: "Owner"
  }).returning({id: teamMembers.id}).execute();


  // Ensure owner_team is not empty
  if (owner_team.length === 0) {
    throw new Error('Failed to add team member');
  }

  return created_team_data; // Return the created team data
}
