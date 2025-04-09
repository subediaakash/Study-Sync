import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import ChatMessage, { Message } from "../ChatMessage";

interface ChatSectionProps {
  userId: string;
  roomId: string;
}

const ChatSection = ({ userId, roomId }: ChatSectionProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      const joinPayload = {
        type: "join",
        userId,
        roomId,
      };
      ws.current?.send(JSON.stringify(joinPayload));
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "chat": {
            const message: Message = {
              id: uuidv4(),
              content: data.message,
              sender: {
                name: data.userId === userId ? "You" : `User ${data.userId}`,
                initials: data.userId === userId ? "YO" : "AN",
                avatar: "",
              },
              timestamp: new Date(data.timestamp),
              isCurrentUser: data.userId === userId,
            };
            setMessages((prev) => [...prev, message]);
            break;
          }

          case "user_joined": {
            const systemMessage: Message = {
              id: uuidv4(),
              content: `User ${data.userId} joined the room.`,
              sender: {
                name: "System",
                initials: "S",
                avatar: "",
              },
              timestamp: new Date(data.timestamp),
              isCurrentUser: false,
            };
            setMessages((prev) => [...prev, systemMessage]);
            break;
          }

          case "user_left": {
            const systemMessage: Message = {
              id: uuidv4(),
              content: `User ${data.userId} left the room.`,
              sender: {
                name: "System",
                initials: "S",
                avatar: "",
              },
              timestamp: new Date(data.timestamp),
              isCurrentUser: false,
            };
            setMessages((prev) => [...prev, systemMessage]);
            break;
          }

          case "room_state": {
            const participantMsg: Message = {
              id: uuidv4(),
              content: `Participants: ${data.participants.join(", ")}`,
              sender: {
                name: "System",
                initials: "S",
                avatar: "",
              },
              timestamp: new Date(data.timestamp),
              isCurrentUser: false,
            };
            setMessages((prev) => [...prev, participantMsg]);
            break;
          }

          case "error": {
            const errorMsg: Message = {
              id: uuidv4(),
              content: `Error: ${data.message}`,
              sender: {
                name: "System",
                initials: "S",
                avatar: "",
              },
              timestamp: new Date(),
              isCurrentUser: false,
            };
            setMessages((prev) => [...prev, errorMsg]);
            break;
          }

          default:
            console.warn("Unknown message type:", data.type);
        }
      } catch (err) {
        console.error("Invalid message received", err);
      }
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      ws.current?.close();
    };
  }, [roomId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const chatPayload = {
      type: "chat",
      userId,
      roomId,
      message: newMessage,
    };

    ws.current?.send(JSON.stringify(chatPayload));
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
