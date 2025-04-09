import React from "react";

export const ProgressBar = ({ progress, timeRemaining, totalTime }) => {
  return (
    <div className="mb-4">
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-study-blue rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-gray-600 text-xs">Focus Time</span>
        <span className="text-gray-600 text-xs">
          {timeRemaining} / {totalTime}
        </span>
      </div>
    </div>
  );
};
