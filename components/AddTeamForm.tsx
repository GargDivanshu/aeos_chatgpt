// AddTeamForm.tsx
"use client"
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

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
      const response = await fetch('/api/createTeam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_name: teamName,
          owner_id: dbUser,
          conversation_name: conversation
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create team');
        setLoading(false);
        return;
      }

      const data = await response.json();
      toast.success("Team creation done, you will be redirected");
      console.log('Created Team and Conversation:', data);
      // Redirect or update UI as needed
    } catch (error) {
      console.error('Failed to create team:', error);
      toast.error('Failed to create team');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-left shadow-md gap-6 rounded-lg absolute top-0 bottom-0 left-0 right-0 m-auto h-fit w-fit flex flex-col p-8">
        <h1 className="text-2xl font-semibold text-center">This is your first team</h1>
        <Label>Team Name</Label>
        <Input value={teamName} onChange={(e) => setTeamName(e.target.value)} />
        <Label>Conversation Name</Label>
        <Input value={conversation} onChange={(e) => setConversation(e.target.value)} />
        <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded" disabled={loading}>
          {loading ? 'Creating...' : 'Create Team'}
        </button>
      </div>
    </form>
  );
}
