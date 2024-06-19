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



const SidebarMobile = ({all_owned_teams, userId, balance, memberTeamsData, userEmail}: Props) => {

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

      
  return (
    <div>SidebarMobile</div>
  )
}

export default SidebarMobile