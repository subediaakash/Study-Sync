import React, { useState } from "react";
import { ProgressBar } from "../ProgressBar";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Lock, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  const handleJoinRoom = async (e) => {
    e?.preventDefault();

    if (room.isPrivate && !showPasswordModal) {
      setShowPasswordModal(true);
      return;
    }

    if (room.isPrivate) {
      if (password !== room.password) {
        console.log(password, room.password);

        setError("Incorrect password");
        return;
      }
    }

    setIsJoining(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3000/api/room/join/${room.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            password: room.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      if (!response.ok && response.status !== 400) {
        setError(data.message || "Failed to join room");
        setIsJoining(false);
        return;
      }
      navigate(`/rooms/${room.id}`);
    } catch (error) {
      setError("Network error when trying to join the room");
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden relative">
      {room.isPrivate && (
        <div className="absolute top-4 right-4 bg-amber-100 px-2 py-1 rounded-full flex items-center gap-1">
          <Lock size={14} className="text-amber-600" />
          <span className="text-xs font-medium text-amber-600">Private</span>
        </div>
      )}

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

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Enter Password</h3>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                  setError("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              This room requires a password to join.
            </p>

            <form onSubmit={handleJoinRoom}>
              <Input
                type="password"
                placeholder="Room password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4"
                autoFocus
              />

              {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword("");
                    setError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-study-blue hover:bg-study-darkBlue"
                >
                  Join Room
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
