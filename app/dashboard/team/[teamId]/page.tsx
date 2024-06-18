import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import TeamInfo from '@/components/TeamInfo';
import axios from 'axios';

type Props = {
  params: {
    teamId: string;
  };
};

const Page = async ({ params: { teamId } }: Props) => {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const userId = await getUser();
  const isAuth = isAuthenticated();
  if (!isAuth) {
    redirect('/');
    return null;
  }

  const dbUser = await db.select().from(users).where(eq(users.email, userId?.email)).execute();
  if (!dbUser || dbUser.length === 0) {
    redirect('/');
    return null;
  }

  const userIdFromDb = dbUser[0].id;
  const userEmailFromDb = dbUser[0].email;

  try {
    const response = await axios.post(`${process.env.KINDE_SITE_URL}/teamDetails`, {
      teamId,
      user_id: userIdFromDb
    });

    const teamData = response.data;

    return (
      <React.Fragment>
        <TeamInfo teamData={teamData} teamId={teamId} userIdFromDb={userIdFromDb} userEmailFromDb={userEmailFromDb} />
      </React.Fragment>
    );
  } catch (error) {
    console.error('Failed to fetch team data:', error.message);
    redirect('/dashboard');
    return null;
  }
};

export default Page;
