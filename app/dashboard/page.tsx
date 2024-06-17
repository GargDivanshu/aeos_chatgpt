import Sidebar from '@/components/Sidebar'
import {db} from '@/lib/db'
import {users, teams} from '@/lib/db/schema'
import { eq } from "drizzle-orm";
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
    console.log(dbUser + " :dbUser")
    let newUser;
    if(!dbUser || dbUser.length == 0) {
        newUser = await db.insert(users).values({
            name: authUser.given_name + " " + authUser.family_name,
            email: authUser.email,
        });
        console.log(JSON.stringify(newUser + " newuser : "))

        // const newTeam = await db.insert(teams).values({
        //     name: 'Your First Team',
        //     ownerId: newUser.id,
        // });
    }
    dbUser = await db.select().from(users).where(eq(users.email, authUser.email));
    console.log(JSON.stringify(dbUser) + " :dbuser again : ")
    let firstTeam = await db.select().from(teams).where(eq(teams.ownerId, dbUser.id));
    if(firstTeam || firstTeam!==NULL) {
        console.log(firstTeam + " :firstTeam: ")
        firstTeam = firstTeam[0];
        // redirect(`/dashboard/team/${firstTeam?.id}`)
    }
    let team_name;

    // let dbUser = db.

    return (
        <main className="flex min-h-screen flex-row">
            <Sidebar/>
      <div className="container text-center relative">
        {
            dbUser ?
            <form actions={createTeam}>
            <div className="text-left shadow-md gap-6 rounded-lg absolute top-0 bottom-0 left-0 right-0 m-auto h-fit w-fit flex flex-col p-8">
            <h1 className="text-2xl font-semibold text-center">
            This is your first team
            </h1>
            <Label>
                Team Name
            </Label>
            <Input value={team_name}>
            </Input>
            <Input className="hidden" value={dbUser.id}/>
            </div>
            </form>
             : 
            null
        } 
      </div>
      </main>
    );
  }