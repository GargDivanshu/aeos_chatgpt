// AddTeamForm.tsx
"use client"
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import {Button} from '@/components/ui/button'
import axios from 'axios';


type Props = {
  dbUser: string;
}

export default function AddTeamForm({ dbUser }: Props) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [teamName, setTeamName] = React.useState<string>("");
  const [conversation, setConversation] = React.useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    toast.success("Team creation started");
    setLoading(true);

    try {
      console.log("----")
      console.log(teamName)
      console.log(dbUser)
      console.log(conversation)
      const response = await axios.post('/api/createTeam', {
          team_name: teamName,
          owner_id: dbUser,
          conversation_name: conversation
      });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   toast.error(errorData.error || 'Failed to create team');
      //   setLoading(false);
      //   return;
      // }

      const data = await response.json();
      toast.success("Team creation done");
      console.log('Created Team and Conversation:', data);
      // Redirect or update UI as needed
    } catch (error) {
      console.error('Failed to create team:', error);
      // toast.error('Failed to create team');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="border border-input bg-background hover:text-accent-foreground text-left shadow-md rounded-lg text-left gap-6 absolute top-0 bottom-0 left-0 right-0 m-auto h-fit md:w-3/5 w-[90%] flex flex-col p-8">
        <h1 className="text-2xl font-semibold text-center">Create Team</h1>
        <Label className="md:text-xl">Team Name</Label>
        <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} />
        <Label className="md:text-xl">Conversation Name</Label>
        <Input value={conversation} onChange={(e) => setConversation(e.target.value)} />
        <Button variant="outline" type="submit" className="mt-4 p-2 text-center mx-auto w-fit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Team'}
        </Button>
      </div>
    </form>
  );
}
