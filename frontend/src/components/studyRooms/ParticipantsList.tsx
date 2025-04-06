import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Participant {
  id: string;
  name: string;
  initials: string;
  status: "studying" | "break";
  isCurrentUser?: boolean;
}

interface ParticipantsListProps {
  participants: Participant[];
}

const ParticipantsList = ({ participants }: ParticipantsListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <h3 className="font-medium text-gray-700 mb-4">
        Currently in this room:
      </h3>

      <div className="space-y-4">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback
                  className={`${
                    participant.isCurrentUser
                      ? "bg-study-lightBlue text-study-blue"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {participant.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{participant.name}</p>
                <p className="text-xs text-gray-500">Joined 20 minutes ago</p>
              </div>
            </div>

            <span
              className={`px-2 py-1 rounded-full text-xs ${
                participant.status === "studying"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {participant.status === "studying" ? "Studying" : "On Break"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;
