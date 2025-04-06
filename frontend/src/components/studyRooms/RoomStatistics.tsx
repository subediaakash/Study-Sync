import React from "react";

const RoomStatistics = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-medium mb-2">Room Statistics</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Focus Time</span>
          <span className="font-medium">2h 15m</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Study Sessions</span>
          <span className="font-medium">3</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Break Time</span>
          <span className="font-medium">25m</span>
        </div>
      </div>
    </div>
  );
};

export default RoomStatistics;
