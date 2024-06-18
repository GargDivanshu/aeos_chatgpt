import { db } from "@/lib/db";
import { users, teams, teamMembers, conversations } from "@/lib/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import ChatComponent from '@/components/ChatComponent';
import {toast} from 'react-hot-toast'


type Props = {
  params: {
    conversationsId: string;
  };
};

const Page = async ({ params: { conversationsId } }: Props) => {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const userId = await getUser();
  const isAuth = isAuthenticated();
  if (!isAuth) redirect('/');

  const dbUser = await db.select().from(users).where(eq(users.email, userId.email)).execute();
  if (!dbUser || dbUser.length === 0) {
    return redirect('/');
  }

  const userIdFromDb = dbUser[0].id;

  const getTeam = await db.select({ teamId: conversations.teamId }).from(conversations).where(eq(conversations.id, conversationsId)).execute();
  if (getTeam.length === 0) {
    toast("some err occured")
    return redirect('/dashboard');
  }

  let conversation_name = await db.select().from(conversations).where(eq(conversations.id, conversationsId)).execute()
  conversation_name = conversation_name[0].content; 


  const teamId = getTeam[0].teamId;

  const response = await fetch('/api/teamDetails', {
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

  return (
    <React.Fragment>
      <ChatComponent conversationsId={parseInt(conversationsId)} conversation_name={conversation_name} />
    </React.Fragment>
  );
};

export default Page;
