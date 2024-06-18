"use client"
import * as React from 'react'
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {User} from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import {ShieldAlert, MoveLeft} from 'lucide-react'


type Props = {
    all_owned_teams :TeamMemberType[];
    userId: string;
    balance: number;
    memberTeamsData: TeamMemberType[];
    userEmail: string;
}

export default function Sidebar({all_owned_teams, userId, balance, memberTeamsData, userEmail}: Props) {
    const {
        user,
      } = useKindeBrowserClient();

      let parsedTeams: TeamMemberType[] = [];
      try {
          // Check if all_owned_teams has a value property
          if (all_owned_teams?.value) {
              // Parse the JSON string in the value property
              parsedTeams = JSON.parse(all_owned_teams.value);
          } else {
              parsedTeams = all_owned_teams; // If it's already an array/object, assign directly
          }
      } catch (error) {
          console.error("Failed to parse teams", error);
      }

      console.log(JSON.stringify(parsedTeams) + " :parsedTeams: ")
      
    return (
        <div className="w-[30%] ml-0 h-screen bg-[#F1F1F1] flex flex-col justify-between relative">
            <div className="text-3xl font-semibold p-4 h-full flex flex-col text-black_">
                CollabGPT
                <Link href="/dashboard">
                <div ><MoveLeft /></div>
                </Link>
                <div className="h-4/5 flex flex-col">
                <span className="text-base my-2">Owner Teams</span>
                <div className="overflow-y-scroll grid grid-cols-1 gap-1 px-2 h-1/2 items-left">
                { parsedTeams && parsedTeams.length >0 ? parsedTeams?.map((team, index) => (
                    <Link className="h-fit" key={index} href={`/dashboard/team/${team.id}`}>
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
                    memberTeamsData.length >0 ? memberTeamsData?.map((team, index) => (
                        <Link className="h-fit" key={index} href={`/dashboard/team/${team.id}`}>
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
        
        <div className="flex flex-row p-2 bottom-0 absolute w-full">
            <div className="w-[20%]"><User size={40}/></div>
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

    <span className="text-sm">Credits: {balance}</span>
            </div>
        </div>
        </div>
    )
}