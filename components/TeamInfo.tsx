// TeamInfo.client.js
"use client"
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import  Link  from 'next/link';
import { User, PenLine } from 'lucide-react'
import { Badge } from "@/components/ui/badge"



const TeamInfo = ({ teamData, teamId, userIdFromDb }) => {
  const [conversations, setConversations] = useState(teamData.conversations);
  const [members, setMembers] = useState(teamData.members);
  const [addEmail, setAddEmail] = useState("");
  const [convoTitle, setConvoTitle] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const conversationTitle = convoTitle; // Directly use the state

    const response = await fetch('http://localhost:3000/api/createConversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamId: teamId, user_id: userIdFromDb, conversation_title: conversationTitle }),
    });

    if (!response.ok) {
      console.error('Failed to create conversation:', response.statusText);
      return;
    }

    const newConversation = await response.json();
    setConversations([...conversations, newConversation]);
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    // No need to create FormData here since you're managing state

    const response = await fetch('http://localhost:3000/api/addMember', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamId: teamId, email: addEmail }),
    });

    console.log(JSON.stringify(response) + " :memberadd");

    if (!response.ok) {
      console.error('Failed to add member:');
      return;
    }

    const newMember = await response.json();
    // Correctly update the members state with the new member
    setMembers([...members, newMember]); // Assuming newMember contains the member details
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
      <ul className="w-fit gap-y-2 flex flex-col">
        {conversations.map((convo) => (
          
         <Link className="flex flex-row gap-x-2 items-center text-center" key={convo.id} href={`/dashboard/conversations/${convo.id}`}>
          <Button variant="outline" className="w-full text-center"><PenLine size={20}/> {convo.content}</Button>
          </Link>
        ))}
      </ul>
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
      </form>

      <h2 className="md:text-xl font-semibold flex ">Members</h2>
      <ul>
        {members.map((member, index) => (
          <Badge key={member.id}>{member.email}</Badge> // Assuming member object has id and name properties
        ))}
      </ul>
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
      </div>
    </div>
  );
};

export default TeamInfo;
