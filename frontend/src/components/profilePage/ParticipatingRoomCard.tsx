// components/RoomCard.tsx
import React from "react";
import { Lock, Users, Calendar, Clock } from "lucide-react";

interface Room {
  id: string;
  name: string;
  category: string;
  description: string;
  isPrivate: boolean;
  password: string | null;
  createdAt: string;
}

interface ParticipatingRoomsProps {
  room: Room;
}

const ParticipatingRoomCard: React.FC<ParticipatingRoomsProps> = ({ room }) => {
  const formattedDate = new Date(room.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              room.isPrivate
                ? "bg-purple-100 text-purple-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {room.isPrivate ? "Private" : "Public"}
          </span>
        </div>

        <div className="mt-2 flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-1" />
          <span className="capitalize">{room.category.toLowerCase()}</span>
        </div>

        <p className="mt-3 text-gray-600">{room.description}</p>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created {formattedDate}</span>
          </div>

          {room.isPrivate && (
            <div className="flex items-center text-sm text-gray-500">
              <Lock className="h-4 w-4 mr-1" />
              <span>Password protected</span>
            </div>
          )}
        </div>

        <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors duration-300">
          Join Room
        </button>
      </div>
    </div>
  );
};

export default ParticipatingRoomCard;
