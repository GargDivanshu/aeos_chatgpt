// Page.server.js
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import TeamInfo from '@/components/TeamInfo'



type Props = {
  params: {
    teamId: string;
  };
};

const Page = async ({ params: { teamId } }: Props) => {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const userId = await getUser();
  const isAuth = isAuthenticated();
  if (!isAuth) redirect('/');

  const dbUser = await db.select().from(users).where(eq(users.email, userId?.email)).execute();
  if (!dbUser || dbUser.length === 0) {
    return redirect('/');
  }

  const userIdFromDb = dbUser[0].id;

  const response = await fetch('http://localhost:3000/api/teamDetails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ teamId, user_id: userIdFromDb }),
  });

  if (!response.ok) {
    console.error('Failed to fetch team data:', response.statusText);
    return redirect('/dashboard');
  }

  const teamData = await response.json();

  return (
    <React.Fragment>
      <TeamInfo teamData={teamData} teamId={teamId} userIdFromDb={userIdFromDb} />
    </React.Fragment>
  );
};

export default Page;
