import React, { useState } from "react";
import { ProgressBar } from "../ProgressBar";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setIsJoining(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/room/join/${room.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok && response.status !== 400) {
        // Handle general errors
        setError(data.message || "Failed to join room");
        setIsJoining(false);
        return;
      }

      // Navigate to the room either if join was successful or if user is already a participant
      navigate(`/rooms/${room.id}`);
    } catch (error) {
      setError("Network error when trying to join the room");
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">{room.name}</h3>
            <p className="text-gray-500 text-sm">{room.category}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-study-lightBlue flex items-center justify-center text-study-blue">
            <room.icon size={20} />
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <Users size={16} />
          <span>{room.participants} participants</span>
        </div>
        <ProgressBar
          progress={room.progress}
          timeRemaining={room.timeRemaining}
          totalTime={room.totalTime}
        />

        {error && <div className="text-red-500 text-sm mt-2 mb-2">{error}</div>}

        <div className="flex justify-between gap-3 mt-4">
          <Link to={`/room/${room.id}/details`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Details
            </Button>
          </Link>
          <div className="flex-1">
            <Button
              className="w-full bg-study-blue hover:bg-study-darkBlue"
              onClick={handleJoinRoom}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Join Room"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
