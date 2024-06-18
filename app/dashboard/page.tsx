import Sidebar from '@/components/Sidebar'
import {db} from '@/lib/db'
import {users, teams, teamMembers} from '@/lib/db/schema'
import { eq, inArray } from "drizzle-orm";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {redirect} from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {createTeam} from '../actions'



export default async function Dashboard() {

    const {getUser, isAuthenticated} = getKindeServerSession()
    const authUser = await getUser()
    if(!authUser) redirect('/')
    
    let dbUser = await db.select().from(users).where(eq(users.email, authUser.email));
  //   console.log(dbUser + " :dbUser")
  //   let newUser;
  //   if(!dbUser || dbUser.length == 0) {
  //       newUser = await db.insert(users).values({
  //           name: authUser.given_name + " " + authUser.family_name,
  //           email: authUser.email,
  //       });
  //       console.log(JSON.stringify(newUser + " newuser : "))

  //       // const newTeam = await db.insert(teams).values({
  //       //     name: 'Your First Team',
  //       //     ownerId: newUser.id,
  //       // });
  //   }
  //   dbUser = await db.select().from(users).where(eq(users.email, authUser.email));
  //   console.log(JSON.stringify(dbUser) + " :dbuser again : ")
    
  //   let all_owned_teams = db.select().from(teams).where(eq(teams.ownerId, dbUser[0].id)).execute();
  //   const memberTeams = await db.select(teamMembers)
  //   .from(teamMembers)
  //   .where(eq(teamMembers.userId, dbUser[0].id))
  //   .where(eq(teamMembers.role, 'Member'))
  //   .execute();  
  //   console.log(memberTeams + " :memberTeams")  

  //   let memberTeamsData; 
  //   if (memberTeams.length > 0) {
  //       const teamIds = memberTeams.map(member => member.teamId);

  // // Step 2: Get details of all teams with the collected team IDs
  //  memberTeamsData = await db.select(teams)
  //   .from(teams)
  //   .where(inArray(teams.id, teamIds))
  //   .execute();
  //     }


  //     let firstTeam = await db.select().from(teams).where(eq(teams.ownerId, dbUser[0].id)).execute();
  //   console.log(JSON.stringify(firstTeam) + " :firstTeam before provessing")
  //   if(firstTeam || firstTeam.length > 0) {
  //       console.log(firstTeam + " :firstTeam: ")
  //       firstTeam = firstTeam[0];
  //       // redirect(`/dashboard/team/${firstTeam?.id}`)
  //   }

      

  //   console.log(memberTeamsData, " :TeamsData")
  //   console.log(all_owned_teams + " :all_owned_team")
    // let dbUser = db.

    return (
        // <main className="flex min-h-screen flex-row">
        //     <Sidebar all_owned_teams={all_owned_teams} userId={dbUser[0].id} balance={dbUser[0].balance} memberTeamsData={memberTeamsData} />
      <div className="container text-center relative">
      {dbUser && (
          <form action={createTeam}>
            <div className="text-left shadow-md gap-6 rounded-lg absolute top-0 bottom-0 left-0 right-0 m-auto h-fit w-fit flex flex-col p-8">
              <h1 className="text-2xl font-semibold text-center">This is your first team</h1>
              <Label>Team Name</Label>
              <Input name="team_name" />
              <Label>Conversation Name</Label>
              <Input name="conversation_name" />
              <Input type="hidden" name="owner_id" value={dbUser[0].id} />
              <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">Create Team</button>
            </div>
          </form>
        )}
      </div>
      // </main>
    );
  }