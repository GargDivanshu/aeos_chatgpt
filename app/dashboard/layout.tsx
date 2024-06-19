import Sidebar from '@/components/Sidebar';
import { db } from '@/lib/db';
import { users, teams, teamMembers } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import SidebarMobile from './../../components/SidebarMobile';

export default async function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const authUser = await getUser();
  if (!authUser) redirect('/');

  let dbUser;
  try {
    dbUser = await db.select().from(users).where(eq(users.email, authUser.email)).execute();
  } catch (error) {
    console.error('Error fetching user from database:', error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p>Unable to load user data. Please try again later.</p>
      </main>
    );
  }

  let newUser;
  if (!dbUser || dbUser.length === 0) {
    try {
      newUser = await db.insert(users).values({
        name: `${authUser.given_name} ${authUser.family_name}`,
        email: authUser.email,
      }).execute();
      dbUser = await db.select().from(users).where(eq(users.email, authUser.email)).execute();
    } catch (error) {
      console.error('Error creating new user in database:', error);
      return (
        <main className="flex min-h-screen flex-col items-center justify-center">
          <p>Unable to create user data. Please try again later.</p>
        </main>
      );
    }
  }

  let all_owned_teams = [];
  let memberTeamsData = [];
  try {
    all_owned_teams = await db.select().from(teams).where(eq(teams.ownerId, dbUser[0].id)).execute();

    const memberTeams = await db.select()
      .from(teamMembers)
      .where(eq(teamMembers.userId, dbUser[0].id))
      .where(eq(teamMembers.role, "Member"))
      .execute();

    if (memberTeams.length > 0) {
      const teamIds = memberTeams.map(member => member.teamId);
      memberTeamsData = await db.select()
        .from(teams)
        .where(inArray(teams.id, teamIds))
        .execute();
    }
    memberTeamsData = memberTeamsData.filter((team) => team.ownerId !== dbUser[0].id)
  } catch (error) {
    console.error('Error fetching teams from database:', error);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <p>Unable to load team data. Please try again later.</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-row justify-center">
      <SidebarMobile
       all_owned_teams={all_owned_teams} 
       userId={dbUser[0].id} 
       balance={dbUser[0].balance} 
       memberTeamsData={memberTeamsData} 
      />
      <Sidebar 
        all_owned_teams={all_owned_teams} 
        userId={dbUser[0].id} 
        balance={dbUser[0].balance} 
        memberTeamsData={memberTeamsData} 
      />
      {children}
    </main>
  );
}
