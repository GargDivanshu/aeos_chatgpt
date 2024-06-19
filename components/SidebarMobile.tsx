"use client"
import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
  import {User} from 'lucide-react'
  import { ScrollArea } from "@/components/ui/scroll-area"
  import {Button} from '@/components/ui/button'
  import {Label} from '@/components/ui/label'
  import Link from 'next/link'
  import {
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger,
    } from "@/components/ui/tooltip"
  import {ShieldAlert, MoveLeft, Menu, CircleUserRound} from 'lucide-react'


  type Props = {
    all_owned_teams :TeamMemberType[];
    userId: string;
    balance: number;
    memberTeamsData: TeamMemberType[];
    userEmail: string;
}



const SidebarMobile = ({all_owned_teams, userId, balance, memberTeamsData, userEmail}: Props) => {

  const {
    user,
  } = useKindeBrowserClient();

  const [parsedTeam, setParsedTeam] = React.useState<TeamMemberType[]>([])


  React.useEffect(() => {
    if (all_owned_teams?.value) {
      // Parse the JSON string in the value property
      setParsedTeam(JSON.parse(all_owned_teams.value))
  } else {
    setParsedTeam(all_owned_teams); // If it's already an array/object, assign directly
  }
  }, [all_owned_teams])
      
 

  console.log(JSON.stringify(parsedTeam) + " :parsedTeams: ")
      
  return (
    <Sheet className="">
      <SheetTrigger asChild>
    <div className="z-10 h-fit absolute left-2 md:hidden"><Menu size={40}/></div>
    </SheetTrigger>
    <SheetContent>

    <div className="text-3xl font-semibold h-full flex flex-col text-black_">
                <Link href="/">CollabGPT</Link>
                <Link href="/dashboard">
                <div className="border-y-[1px] border-[#6B6B6D]/90 py-[2px] flex items-center text-base font-normal"><MoveLeft /> Dashboard</div>
                </Link>
                <div className="h-4/5 flex flex-col">
                <span className="text-base my-2">Owner Teams</span>
                <div className="overflow-y-scroll grid grid-cols-1 px-2 h-1/2 items-left">
                { parsedTeam && parsedTeam?.length >0 ? parsedTeam?.map((team, index) => (
                    <Link className="h-fit flex justify-center" key={index} href={`/dashboard/team/${team.id}`}>
                           <Button variant="custom" key={index} className="text-left" >
                            {team.name}
                           </Button>
                    </Link>
                        ))
                    :
                    <div>
                    <ShieldAlert size={30} className="m-auto"/>
                    <div className="text-xs text-center">You haven&apos;t created any team yet</div>
                    </div>
                    }
                </div>


                <span className="text-base my-2">Member Teams</span>
                <div className="overflow-y-scroll grid grid-cols-1 gap-1 px-2 h-1/2 items-left">
                {
                    memberTeamsData?.length >0 ? memberTeamsData?.map((team, index) => (
                        <Link className="h-fit flex items-center" key={index} href={`/dashboard/team/${team.id}`}>
                        <Button variant="custom" className="text-left">
                            {team.name}
                        </Button>
                        </Link>
                    )) : 
                    <div>
                    <ShieldAlert size={30} className="m-auto"/>
                    <div className="text-xs text-center">You are not a member of anyone&apos;s Team</div>
                    </div>
                }
                </div>


                
                </div>
            </div>
        
        <div className="flex flex-row p-2 bottom-0 absolute w-full border-t-[1px] border-[#6B6B6D]">
            <div className="w-[20%]"><CircleUserRound size={35}/></div>
            <div className="text-xs w-[80%] font-semibold flex flex-col">
            <TooltipProvider>
            <Tooltip>
            <TooltipTrigger asChild>
            <span className="text-sm">{user?.given_name} {user?.family_name}</span>
        </TooltipTrigger>
            
            <TooltipContent>
            <span>{user?.email}</span>
        </TooltipContent>
            </Tooltip>
    </TooltipProvider>

    <span className="text-xs">Credits: {balance}</span>
            </div>
        </div>
        
      </SheetContent>
    </Sheet>
  )
}

export default SidebarMobile