import Sidebar from '@/components/Sidebar'
import {db} from '@/lib/db'
import {users, teams, teamMembers} from '@/lib/db/schema'
import { eq, inArray } from "drizzle-orm";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from 'next/navigation'
// import { UserProvider } from '@/context/UserContext';


export default async function DashboardLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {

    const {getUser, isAuthenticated} = getKindeServerSession()
    const authUser = await getUser()
    if(!authUser) redirect('/')
    
    let dbUser = await db.select().from(users).where(eq(users.email, authUser.email));
    let newUser;
    if(!dbUser || dbUser.length == 0) {
        newUser = await db.insert(users).values({
            name: authUser.given_name + " " + authUser.family_name,
            email: authUser.email,
        });

        // const newTeam = await db.insert(teams).values({
        //     name: 'Your First Team',
        //     ownerId: newUser.id,
        // });
    }
    dbUser = await db.select().from(users).where(eq(users.email, authUser.email));
    
    let all_owned_teams = db.select().from(teams).where(eq(teams.ownerId, dbUser[0].id)).execute();
    const memberTeams = await db.select()
    .from(teamMembers)
    .where(eq(teamMembers.userId, dbUser[0].id))
    .where(eq(teamMembers.role, 'Member'))
    .execute();  

    let memberTeamsData; 
    if (memberTeams.length > 0) {
        const teamIds = memberTeams.map(member => member.teamId);

  // Step 2: Get details of all teams with the collected team IDs
   memberTeamsData = await db.select(teams)
    .from(teams)
    .where(inArray(teams.id, teamIds))
    .execute();
      }

      console.log(JSON.stringify(memberTeamsData) + " :memberTeamsData: for " + dbUser[0].id)


      let firstTeam = await db.select().from(teams).where(eq(teams.ownerId, dbUser[0].id)).execute();
    // if(firstTeam.length > 0) {
    //     console.log(firstTeam + " :firstTeam: ")
    //     firstTeam = firstTeam[0];
    //     redirect(`/dashboard/team/${firstTeam?.id}`)
    // }



    return (
        // <UserProvider>
        <>
        <main className="flex min-h-screen flex-row">
            <Sidebar all_owned_teams={all_owned_teams} userId={dbUser[0].id} balance={dbUser[0].balance} memberTeamsData={memberTeamsData} />
        {/* Include shared UI here e.g. a header or sidebar */}
   
        {children}
      </main>
      </>
      // </UserProvider>
    )
  }