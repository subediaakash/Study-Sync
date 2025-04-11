import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Header } from "@/components/browseRooms/Header";
import { SearchAndFilter } from "@/components/browseRooms/SearchAndFilter";
import { RoomCard } from "@/components/browseRooms/RoomCard";
import { EmptyResults } from "@/components/browseRooms/EmptyResults";
import { CATEGORIES } from "@/components/browseRooms/constants";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Code, FlaskConical, Music, Users } from "lucide-react"; // Import icons

const BrowseRooms = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categoryIcons = {
    SCIENCE: FlaskConical,
    TECHNOLOGY: Code,
    ARTS: Music,
    LITERATURE: BookOpen,
    DEFAULT: Users,
  };

  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms", searchQuery, selectedCategory],
    queryFn: async () => {
      let url = "http://localhost:3000/api/room/find?";

      if (searchQuery) {
        url += `name=${searchQuery}&`;
      }

      if (selectedCategory !== "All") {
        url += `category=${selectedCategory.toUpperCase()}&`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data.map((room) => ({
        id: room.id,
        name: room.name,
        category: room.category,
        participants: room.participants?.length || 0,
        progress: 0,
        timeRemaining: room.timerSettings?.focusTime * 60 || 1500,
        totalTime: room.timerSettings?.focusTime * 60 || 1500,
        icon: categoryIcons[room.category] || categoryIcons.DEFAULT,
      }));
    },
    enabled: true,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 mt-16">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Header />

        <SearchAndFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">Loading rooms...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center py-12">
            <p className="text-red-500">Error loading rooms: {error.message}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms && rooms.length > 0
                ? rooms.map((room) => <RoomCard key={room.id} room={room} />)
                : null}
            </div>

            {(!rooms || rooms.length === 0) && <EmptyResults />}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseRooms;
