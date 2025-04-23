import React from "react";
import { useParticipatingRooms } from "./UseParticipatingRooms";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import ParticipatingRoomCard from "./ParticipatingRoomCard";

const ParticipatingRooms: React.FC = () => {
  const { user: currentUser } = useAuth() as { user: { id: string } | null };
  const {
    data: rooms,
    isLoading,
    error,
  } = useParticipatingRooms(currentUser?.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">
          Error loading rooms. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Your Study Rooms
      </h1>
      <p className="text-gray-600 mb-8">
        Rooms you're currently participating in
      </p>

      {rooms?.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <p className="text-gray-500">
            You're not participating in any rooms yet.
          </p>
          <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Explore Rooms
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms?.map((room) => (
            <ParticipatingRoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ParticipatingRooms;
