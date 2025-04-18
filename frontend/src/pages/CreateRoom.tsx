import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useAtomValue } from "jotai";

import { Button } from "@/components/ui/button";
import { authAtom } from "@/auth/atom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

interface RoomData {
  name: string;
  ownerId: string | null;
  category: string;
  description: string;
  isPrivate: boolean;
  password: string | null;
  timerSettings: {
    name: string;
    focusTime: number;
    breakTime: number;
  };
}

const createRoomAPI = async (roomData: RoomData) => {
  const authToken = Cookies.get("auth_token");

  const response = await axios.post(
    "http://localhost:3000/api/room/",
    { ...roomData },
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      withCredentials: true,
    }
  );

  return response.data;
};

const formatTimeValue = (minutes: number, seconds: number = 0): string => {
  return `${minutes}.${seconds.toString().padStart(2, "0")}`;
};

const parseTimeValue = (
  timeValue: string
): { minutes: number; seconds: number } => {
  const [minutesPart, secondsPart = "00"] = timeValue.split(".");
  return {
    minutes: parseInt(minutesPart, 10),
    seconds: parseInt(secondsPart, 10),
  };
};

const CreateRoom = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    roomName: "",
    category: "",
    description: "",
    focusTime: "25.00",
    breakTime: "5.00",
    isPrivate: false,
    password: "",
  });

  const createRoomMutation = useMutation({
    mutationFn: (data: RoomData) => createRoomAPI(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      toast.success("Room created successfully!");
      navigate(`/rooms/${data.id}`);
    },
    onError: (error: AxiosError) => {
      toast.error((error.response?.data as string) || "Failed to create room");
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPrivate: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomName.trim()) {
      toast.error("Room name is required");
      return;
    }

    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    if (formData.isPrivate && !formData.password.trim()) {
      toast.error("Password is required for private rooms");
      return;
    }

    const focusTimeParts = parseTimeValue(formData.focusTime);
    const breakTimeParts = parseTimeValue(formData.breakTime);

    const focusTimeInMinutes =
      focusTimeParts.minutes + focusTimeParts.seconds / 60;
    const breakTimeInMinutes =
      breakTimeParts.minutes + breakTimeParts.seconds / 60;

    const roomData: RoomData = {
      name: formData.roomName,
      ownerId: userId,
      category: capitaliseAllWords(formData.category),
      description: formData.description,
      isPrivate: formData.isPrivate,
      password: formData.isPrivate ? formData.password : null,
      timerSettings: {
        name: "Custom Timer",
        focusTime: focusTimeInMinutes,
        breakTime: breakTimeInMinutes,
      },
    };

    console.log(roomData);

    createRoomMutation.mutate(roomData);
  };

  const capitaliseAllWords = (str: string): string => {
    return str.toUpperCase();
  };

  const categories = [
    "mathematics",
    "computer science",
    "languages",
    "technology",
    "humanities",
    "science",
    "business",
  ];

  const focusTimeOptions = [
    { minutes: 25, seconds: 0 },
    { minutes: 25, seconds: 30 },
    { minutes: 30, seconds: 0 },
    { minutes: 45, seconds: 0 },
    { minutes: 50, seconds: 0 },
    { minutes: 60, seconds: 0 },
  ];

  const breakTimeOptions = [
    { minutes: 5, seconds: 0 },
    { minutes: 5, seconds: 30 },
    { minutes: 10, seconds: 0 },
    { minutes: 15, seconds: 0 },
  ];

  const formatTimeDisplay = (minutes: number, seconds: number): string => {
    return `${minutes} min ${seconds > 0 ? `${seconds} sec` : ""}`;
  };

  const user = useAtomValue(authAtom) as { id: string };
  console.log("Auth user data:", user);

  const userId = user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 border border-gray-200">
          <h1 className="text-3xl font-semibold mb-8 text-gray-800">
            Create a <span className="text-study-blue">Study Room</span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Name */}
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                name="roomName"
                placeholder="Enter a name for your study room"
                value={formData.roomName}
                onChange={handleInputChange}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {capitaliseAllWords(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description{" "}
                <span className="text-sm text-gray-400">(Optional)</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what you'll be studying..."
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            {/* Focus / Break Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="focusTime">Focus Time</Label>
                <Select
                  value={formData.focusTime}
                  onValueChange={(value) =>
                    handleSelectChange("focusTime", value)
                  }
                >
                  <SelectTrigger id="focusTime">
                    <SelectValue placeholder="Select focus time" />
                  </SelectTrigger>
                  <SelectContent>
                    {focusTimeOptions.map((option) => {
                      const value = formatTimeValue(
                        option.minutes,
                        option.seconds
                      );
                      return (
                        <SelectItem key={value} value={value}>
                          {formatTimeDisplay(option.minutes, option.seconds)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="breakTime">Break Time</Label>
                <Select
                  value={formData.breakTime}
                  onValueChange={(value) =>
                    handleSelectChange("breakTime", value)
                  }
                >
                  <SelectTrigger id="breakTime">
                    <SelectValue placeholder="Select break time" />
                  </SelectTrigger>
                  <SelectContent>
                    {breakTimeOptions.map((option) => {
                      const value = formatTimeValue(
                        option.minutes,
                        option.seconds
                      );
                      return (
                        <SelectItem key={value} value={value}>
                          {formatTimeDisplay(option.minutes, option.seconds)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Private Room */}
            <div className="flex items-center justify-between border-t pt-6">
              <div>
                <Label htmlFor="isPrivate">Private Room</Label>
                <p className="text-sm text-gray-500">
                  Require a password to join
                </p>
              </div>
              <Switch
                id="isPrivate"
                checked={formData.isPrivate}
                onCheckedChange={handleSwitchChange}
              />
            </div>

            {/* Password */}
            {formData.isPrivate && (
              <div className="space-y-2">
                <Label htmlFor="password">Room Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter a password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/browse-rooms")}
                disabled={createRoomMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-study-blue hover:bg-study-darkBlue text-white"
                disabled={createRoomMutation.isPending}
              >
                {createRoomMutation.isPending ? "Creating..." : "Create Room"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
