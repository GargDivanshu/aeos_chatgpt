"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {Button} from '@/components/ui/button'
import {RegisterLink, LoginLink, LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs";





export default function Navbar() {


  const {user} = useKindeBrowserClient();

  return (
    <NavigationMenu >
      <NavigationMenuList className="gap-x-4">
        {!user ? 
        (<div className="flex items-right">
        <NavigationMenuItem className="mx-4">
          <Button className="bg-[#ECECEC]">
        <LoginLink postLoginRedirectURL="/dashboard">Sign in</LoginLink> 
        </Button>
        </NavigationMenuItem>

        <NavigationMenuItem >
          <Button className="bg-[#ECECEC]">
            <RegisterLink postLoginRedirectURL="/dashboard">Sign up</RegisterLink>
          </Button>
        </NavigationMenuItem>
        </div>)
        :
        <NavigationMenuItem>
          <Button className="bg-[#ECECEC]">
            <LogoutLink>Log out</LogoutLink> 
          </Button>  
        </NavigationMenuItem>
        }
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
