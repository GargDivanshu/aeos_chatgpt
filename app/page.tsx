import Image from "next/image";
import Navbar from '../components/Navbar'
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { redirect } from 'next/navigation'


export default async function Home() {

  const {getUser, isAuthenticated} = getKindeServerSession()
  return (
    <main className="flex min-h-screen flex-col items-center md:px-64 ">
      <Navbar/>

      {
        await isAuthenticated() ? 
        redirect('/dashboard')
        : 
        (
<div className="flex flex-col gap-12 w-full max-w-5xl items-center my-16 text-center justify-between font-mono text-sm lg:flex">
        <h1 className="mx-auto md:text-5xl text-3xl">Welcome to CollaborateGPT</h1>
        <h3 className="w-3/4">Your all in one solution to form and collaborate in teams and use ChatGPT among different teammates</h3>

        <Link href="/dashboard">
        <Button className="bg-[#ECECEC]">
          Dashboard
        </Button>
        </Link>
      </div>
        )
      }
      


    </main>
  );
}
