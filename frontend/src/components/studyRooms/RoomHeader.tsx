import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import { toast } from "sonner";

interface RoomInfo {
  name: string;
  category: string;
  isOwner: boolean;
}

interface RoomHeaderProps {
  roomInfo: RoomInfo;
  roomId: string;
}

const RoomHeader = ({ roomInfo, roomId }: RoomHeaderProps) => {
  const leaveRoom = () => {
    toast.info("You have left the study room");
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <Link to="/browse-rooms" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">{roomInfo.name}</h1>
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
          {roomInfo.category}
        </span>
      </div>

      <div className="flex space-x-2">
        {roomInfo.isOwner && (
          <Link to={`/room/${roomId}/manage`}>
            <Button
              variant="outline"
              className="border-study-blue text-study-blue hover:bg-study-lightBlue"
            >
              <Settings size={16} className="mr-2" />
              Manage Room
            </Button>
          </Link>
        )}

        <Button
          variant="outline"
          onClick={leaveRoom}
          className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          Leave Room
        </Button>
      </div>
    </div>
  );
};

export default RoomHeader;
