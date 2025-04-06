import React from "react";
import { Button } from "@/components/ui/button";

const GoalsSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Current Goals</h3>
        <Button variant="ghost" size="sm" className="text-study-blue">
          + Add
        </Button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center">
            <div className="w-3 h-3 bg-study-blue rounded-sm"></div>
          </div>
          <span className="text-sm">Complete calculus problems 1-5</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded border border-gray-300"></div>
          <span className="text-sm">Review chapter notes</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded border border-gray-300"></div>
          <span className="text-sm">Prepare questions for next session</span>
        </div>
      </div>
    </div>
  );
};

export default GoalsSection;
