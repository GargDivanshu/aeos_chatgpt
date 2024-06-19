import Sidebar from '@/components/Sidebar'
import {db} from '@/lib/db'
import {users, teams, teamMembers} from '@/lib/db/schema'
import { eq } from "drizzle-orm";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from 'next/navigation'

import AddTeamForm from '@/components/AddTeamForm'


export default async function Dashboard() {

    const {getUser, isAuthenticated} = getKindeServerSession()
    const authUser = await getUser()
    if(!authUser) redirect('/')
    
    let dbUser = await db.select().from(users).where(eq(users.email, authUser.email));

    return (
      <div className="text-center relative w-full">
      {dbUser && (
          <AddTeamForm dbUser={dbUser[0].id}/>
        )}
      </div>
    );
  }