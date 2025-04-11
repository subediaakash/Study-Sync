import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Participant {
  id: string;
  name: string;
  email: string;
}

interface ParticipantsListProps {
  roomId: string;
  currentUserId?: string;
}

const fetchParticipants = async (roomId: string): Promise<Participant[]> => {
  const response = await fetch(
    `http://localhost:3000/api/room/${roomId}/participants`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch participants");
  }
  return response.json();
};

const ParticipantsList = ({ roomId }: ParticipantsListProps) => {
  const {
    data: participants = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["participants", roomId],
    queryFn: () => fetchParticipants(roomId),
  });

  const processedParticipants = participants.map((participant) => {
    const initials = participant.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const status = Math.random() > 0.5 ? "studying" : "break";

    return {
      ...participant,
      initials,
      status,
    };
  });

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 h-full">
        <p className="text-red-500">Error loading participants</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <h3 className="font-medium text-gray-700 mb-4">
        Currently in this room: {!isLoading && `(${participants.length})`}
      </h3>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-3 w-[80px]" />
                </div>
              </div>
              <Skeleton className="h-6 w-[60px] rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {processedParticipants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{participant.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{participant.name}</p>
                  <p className="text-xs text-gray-500">{participant.email}</p>
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
      )}
    </div>
  );
};

export default ParticipantsList;
