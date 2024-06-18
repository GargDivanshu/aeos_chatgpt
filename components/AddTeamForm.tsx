"use client"
import React from 'react'
import {Label} from '@/components/ui/label'
import {Input} from '@/components/ui/input'
import {createTeam} from '../app/actions.ts'
import { toast } from 'react-hot-toast';


type Props = {
    dbUser: string;
}

export default function AddTeamForm({dbUser}: Props) {
    const [loading, setloading] = React.useState<boolean>(false)
    const [teamName, setTeamName] = React.useState<string>("")
    const [ownerId, setOwnerId] = React.useState<number>(0)
    const [conversation, setConversation] = React.useState<string>("")



    const handleSubmit = () => {
        toast.success("team creation started")
        setloading(true)
        createTeam(teamName,dbUser , conversation)
        toast.success("team creation done, you will be redirected")
    }


    return (
        <form action={handleSubmit}>
            <div className="text-left shadow-md gap-6 rounded-lg absolute top-0 bottom-0 left-0 right-0 m-auto h-fit w-fit flex flex-col p-8">
              <h1 className="text-2xl font-semibold text-center">This is your first team</h1>
              <Label>Team Name</Label>
              <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} />
              <Label>Conversation Name</Label>
              <Input value={conversation} onChange={(e) => setConversation(e.target.value)} />
              <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">Create Team</button>
            </div>
          </form>
    )
}