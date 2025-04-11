import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeSettings {
  id: string;
  focusTime: number; // in minutes
  breakTime: number; // in minutes
  remainingTime: number; // in minutes
}

interface RoomStatisticsProps {
  roomId: string;
}

const fetchTimeSettings = async (roomId: string): Promise<TimeSettings> => {
  const response = await fetch(
    `http://localhost:3000/api/room/${roomId}/time`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch time settings");
  }
  return response.json();
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const RoomStatistics = ({ roomId }: RoomStatisticsProps) => {
  const {
    data: timeSettings,
    isLoading,
    isError,
  } = useQuery<TimeSettings>({
    queryKey: ["timeSettings", roomId],
    queryFn: () => fetchTimeSettings(roomId),
  });

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-medium mb-2">Room Statistics</h3>
        <p className="text-red-500 text-sm">Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-medium mb-2">Room Statistics</h3>
      {isLoading ? (
        <div className="space-y-3 text-sm">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Focus Duration</span>
            <span className="font-medium">
              {formatTime(timeSettings?.focusTime || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Break Duration</span>
            <span className="font-medium">
              {formatTime(timeSettings?.breakTime || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Remaining Time</span>
            <span className="font-medium">
              {formatTime(timeSettings?.remainingTime || 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomStatistics;
