import { ProgressBar } from "../ProgressBar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export const RoomCard = ({ room }) => {
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

        <div className="flex justify-between gap-3">
          <Link to={`/room/${room.id}/details`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Details
            </Button>
          </Link>
          <Link to={`/rooms/${room.id}`} className="flex-1">
            <Button className="w-full bg-study-blue hover:bg-study-darkBlue">
              Join Room
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
