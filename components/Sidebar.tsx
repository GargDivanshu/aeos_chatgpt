"use client"
import * as React from 'react'
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";
import {User} from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import {Button} from '@/components/ui/button'



export default function Sidebar() {
    const {
        permissions,
        isLoading,
        user,
        accessToken,
        organization,
        userOrganizations,
        getPermission,
        getBooleanFlag,
        getIntegerFlag,
        getFlag,
        getStringFlag,
        getClaim,
        getAccessToken,
        getToken,
        getIdToken,
        getOrganization,
        getPermissions,
        getUserOrganizations
      } = useKindeBrowserClient();

      console.log(user)

      
    return (
        <div className="w-[20%] ml-0 h-screen bg-[#F1F1F1] flex flex-col justify-between relative">
            <div className="text-3xl font-semibold p-4 h-full flex flex-col text-black_">
                CollabGPT
                <div className="h-4/5 flex flex-col">
                <span className="text-base my-2">Owner Teams</span>
                <div className="overflow-y-scroll grid grid-cols-1 gap-1 px-2 h-1/2 items-left">
                <Button className="text-left">
                    Chat
                </Button>
                <Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button>
                </div>


                <span className="text-base my-2">Member Teams</span>
                <div className="overflow-y-scroll grid grid-cols-1 gap-1 px-2 h-1/2 items-left">
                <Button className="text-left">
                    Chat
                </Button>
                <Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button><Button className="text-left">
                    Chat
                </Button>
                </div>


                
                </div>
            </div>
        
        <div className="flex flex-row p-2 bottom-0 absolute w-full">
            <div className="w-[20%]"><User size={40}/></div>
            <div className="text-xs w-[80%] font-semibold flex flex-col">
            <span>{user?.email}</span>
            <span className="text-sm">{user?.given_name} {user?.family_name}</span>
            </div>
        </div>
        </div>
    )
}