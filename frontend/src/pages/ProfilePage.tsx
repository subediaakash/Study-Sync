import { useAtomValue } from "jotai";
import { authAtom } from "@/auth/atom";
import { useCreatedRooms } from "@/components/profilePage/UseCreatedRooms";
import CreatedRooms from "@/components/profilePage/CreatedRooms";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import ParticipatingRooms from "@/components/profilePage/ParticipatingRooms";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function CreatedRoomsPage() {
  const user = useAtomValue(authAtom) as { id: string } | null;
  const userId = user?.id;
  const navigate = useNavigate();

  const {
    data: rooms = [],
    isLoading,
    error,
    refetch,
  } = useCreatedRooms(userId);

  const handleEditRoom = useCallback(
    (roomId: string) => {
      const roomToEdit = rooms.find((room) => room.id === roomId);
      if (roomToEdit) {
        navigate(`/edit-room/${roomId}`, { state: { roomData: roomToEdit } });
        console.log("Room to edit:", roomToEdit);
      } else {
        console.warn(`Room with ID ${roomId} not found in fetched data.`);
      }
    },
    [navigate, rooms]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">
          Failed to load your rooms: {error.message}
        </p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="max-w-3xl mx-auto">
        <CreatedRooms rooms={rooms} onEditRoom={handleEditRoom} />
      </div>
      <div className="max-w-3xl mx-auto">
        <ParticipatingRooms />
      </div>
    </div>
  );
}
