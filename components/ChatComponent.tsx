"use client";
import React from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";

type Props = { conversationsId: number; conversation_name: string; };

const ChatComponent = ({ conversationsId, conversation_name }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["chat", conversationsId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        conversationsId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: `/api/chat`,
    body: {
      conversationsId, // Make sure this is being passed correctly
    },
    initialMessages: data || [],
  });

  // Debugging to ensure conversationsId is being passed
  React.useEffect(() => {
  }, [conversationsId]);

  // Debugging to ensure messages are being updated
  React.useEffect(() => {
  }, [messages]);

  // Auto-scroll to the bottom of the message list
  React.useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="relative h-screen w-full overflow-y-auto" id="message-container">
      {/* header */}
      <div className="sticky top-0 inset-x-0 p-2 bg-white h-fit border-b-[1px] border-[#6B6B6D]">
        <h3 className="text-xl font-bold md:text-left text-center">Chat - {conversation_name}</h3>
      </div>

      {/* message list */}
      <MessageList messages={messages} isLoading={isLoading} />

      <form
        onSubmit={handleSubmit}
        className="absolute bottom-0 inset-x-0 px-2 py-4 bg-white border-t-[1px] border-[#6B6B6D]"
      >
        <div className="flex">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask any question..."
            className="w-full"
          />
          <Button className="bg-[#858585] ml-2 flex items-center">
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
