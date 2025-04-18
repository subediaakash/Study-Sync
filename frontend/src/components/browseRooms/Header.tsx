import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Browse Study Rooms</h1>
      <Link to="/create-rooms">
        <Button className="bg-study-blue hover:bg-study-darkBlue">
          Create New Room
        </Button>
      </Link>
    </div>
  );
};
