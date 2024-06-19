// TeamInfo.client.js
"use client"
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import  Link  from 'next/link';
import { User, PenLine } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {CircleX} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import toast from 'react-hot-toast'
import axios from 'axios'



const TeamInfo = ({ teamData, teamId, userIdFromDb, userEmailFromDb }) => {
  const [conversations, setConversations] = useState(teamData.conversations);
  const [members, setMembers] = useState(teamData.members);
  const [addEmail, setAddEmail] = useState("");
  const [convoTitle, setConvoTitle] = useState("");

  const [selectedMember, setSelectedMember] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault();
    const conversationTitle = convoTitle; // Directly use the state

    const response = await fetch(`/api/createConversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamId: teamId, user_id: userIdFromDb, conversation_title: conversationTitle }),
    });

    if (!response.ok) {
      console.error('Failed to create conversation:', response.statusText);
      // toast.error('Failed to create conversation:', response.statusText)
      return;
    }

    const newConversation = await response.json();
    toast.success('Conversation Added successfully')
    setConversations([...conversations, newConversation]);
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    // No need to create FormData here since you're managing state

    const response = await fetch(`/api/addMember`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamId: teamId, email: addEmail }),
    });

    if (!response.ok) {
      console.error('Failed to add member:');
      toast.error(`Failed to add member : ${response.error}`)
      return;
    }

    const newMember = await response.json();
    toast.success("Member added successfully")
    setMembers([...members, newMember]); // Assuming newMember contains the member details
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) {
        toast.error('No member selected');
        return;
    }

    try {
        const response = await fetch(`/api/deleteMember`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ memberId: selectedMember.id, teamId: teamId }),
        });

        if (response.ok) {
            toast.success('Member deleted successfully');

            setMembers(members.filter(member => member.id !== selectedMember.id));

            setSelectedMember(null);
        } else {
            const errorData = await response.json();
            toast.error(errorData.error || 'Failed to delete member');
        }
    } catch (err) {
        console.error(err);
        toast.error('Internal Server Error');
    }
};

  const { team_name, ownerName, ownerEmail, memberEmails, role } = teamData;
  console.log(JSON.stringify(teamData) + " ::conversations")

  return (
    <div className="container text-center relative">
      {/* Render static parts here */}
      <div className="border border-input bg-background hover:text-accent-foreground text-left shadow-md gap-2 rounded-lg absolute top-0 bottom-0 left-0 right-0 m-auto h-fit w-4/5 flex flex-col p-8">
      <h1 className="md:text-2xl text-3xl text-center font-semibold">{team_name}</h1>

      <div className="flex flex-row gap-x-2 items-center">
      <User size={30} />
      <p><strong>Owner:</strong> {ownerName} ({ownerEmail})</p>
      </div>
      {/* <p><strong>Role:</strong> {role}</p> */}
      <h2 className="md:text-xl font-semibold">Conversations</h2>
      <ul className="w-fit gap-y-2 flex flex-col w-full">
        {conversations.map((convo) => (
          
         <Link className="flex flex-row gap-x-2 items-center text-center w-full" key={convo.id} href={`/dashboard/conversations/${convo.id}`}>
          <Button variant="outline" className="w-full text-center">{convo.content}</Button>
          </Link>
        ))}
      </ul>
      { userEmailFromDb === ownerEmail ? 
      <form onSubmit={handleSubmit}>
        <Label htmlFor="conversationTitle">New Conversation Title</Label>
        <div className="flex md:flex-row flex-col gap-x-2">
        <Input id="conversationTitle" name="conversation_title" type="text"
        onChange={(e) => setConvoTitle(e.target.value)}
        className="w-3/4"
        value={convoTitle} required />
        <Button variant="outline" 
        className="w-1/4 text-center"
        type="submit">Create Conversation</Button>
        </div>
      </form> : null}

      <h2 className="md:text-xl font-semibold flex flex-wrap">Members</h2>
      <ul>
        {
        userEmailFromDb === ownerEmail ? 
        members.map((member, index) => (
          <Dialog key={member.id} onOpenChange={(isOpen) => isOpen && setSelectedMember(member)}>
            <DialogTrigger asChild>
          <Badge className="bg-[#858585] hover:bg-[#858585]/90 relative" >
            <CircleX className="absolute -top-2 -right-2 text-black" size={18}/> 
            {member.email}
          </Badge> 
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
          <DialogTitle>Delete Member</DialogTitle>
          <DialogDescription>
            Click on below button to delete {member.name} ({member.email}) from this Team
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mx-auto ">
          <Button 
          onClick={handleDeleteMember}
          variant="destructive" type="submit">Delete User</Button>
        </DialogFooter>
          </DialogContent>
          </Dialog>
        )) : 
        members.map((member, index) => (
          <Badge key={member.id} className="bg-[#858585] hover:bg-[#858585]/90" >
            {member.email}
          </Badge> 
        ))
        }
      </ul>

      {
        userEmailFromDb === ownerEmail ? (
        <form onSubmit={handleAddMember}>
        <Label htmlFor="memberEmail">New Member Email</Label>
        <div className="flex md:flex-row flex-col gap-x-2">
        <Input id="memberEmail" name="member_email" type="text"
        onChange={(e) => setAddEmail(e.target.value)}
        className="w-3/4"
        value={addEmail} required />
        <Button variant="outline" 
        className="w-1/4 text-center"
        type="submit">Add Member</Button>
        </div>
      </form>
        ) : 
        null
      }
      
      </div>
    </div>
  );
};

export default TeamInfo;
