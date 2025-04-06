import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ChatMessage, { Message } from "../ChatMessage";

interface ChatSectionProps {
  initialMessages: Message[];
}

const ChatSection = ({ initialMessages }: ChatSectionProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const message: Message = {
      id: uuidv4(),
      content: newMessage,
      sender: {
        name: "You",
        initials: "YO",
        avatar: "",
      },
      timestamp: new Date(),
      isCurrentUser: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex-1 flex flex-col mb-4">
      <ScrollArea className="flex-1">
        <div className="p-2">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <Separator className="my-3" />

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!newMessage.trim()}
          className="bg-study-blue hover:bg-study-darkBlue"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatSection;
