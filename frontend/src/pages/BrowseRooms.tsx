import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Header } from "@/components/browseRooms/Header";
import { SearchAndFilter } from "@/components/browseRooms/SearchAndFilter";
import { RoomCard } from "@/components/browseRooms/RoomCard";
import { EmptyResults } from "@/components/browseRooms/EmptyResults";
import { ROOMS, CATEGORIES } from "@/components/browseRooms/constants";

const BrowseRooms = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = ROOMS.filter((room) => {
    const matchesCategory =
      selectedCategory === "All" || room.category === selectedCategory;
    const matchesSearch = room.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>

        {filteredRooms.length === 0 && <EmptyResults />}
      </div>
    </div>
  );
};

export default BrowseRooms;
