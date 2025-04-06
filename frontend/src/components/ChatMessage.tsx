import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Message {
  id: string;
  content: string;
  sender: {
    name: string;
    avatar?: string;
    initials: string;
  };
  timestamp: Date;
  isCurrentUser: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formattedTime = new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "numeric",
  }).format(message.timestamp);

  return (
    <div
      className={`flex items-start gap-3 mb-4 ${
        message.isCurrentUser ? "flex-row-reverse" : ""
      }`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
        <AvatarFallback className="bg-study-lightBlue text-study-blue">
          {message.sender.initials}
        </AvatarFallback>
      </Avatar>

      <div
        className={`max-w-[80%] ${message.isCurrentUser ? "text-right" : ""}`}
      >
        <div className="flex items-center mb-1 gap-2">
          {!message.isCurrentUser && (
            <span className="font-medium text-sm">{message.sender.name}</span>
          )}
          <span className="text-xs text-gray-500">{formattedTime}</span>
        </div>

        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            message.isCurrentUser
              ? "bg-study-blue text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
