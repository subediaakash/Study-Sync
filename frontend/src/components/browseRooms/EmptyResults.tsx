import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const EmptyResults = () => {
  return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-4">
        No study rooms found matching your criteria
      </p>
      <Link to="/create-room">
        <Button className="bg-study-blue hover:bg-study-darkBlue">
          Create a New Room
        </Button>
      </Link>
    </div>
  );
};
